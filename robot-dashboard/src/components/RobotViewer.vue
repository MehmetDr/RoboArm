<template>
  <div ref="mountEl" class="robot-viewer">
    <!-- Loading overlay -->
    <div v-if="!modelLoaded" class="loading-overlay">
      <div class="spinner"></div>
      <span>Loading 3D Model…</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js'
import { useRobot, jointConfigs } from '../composables/useRobot.js'

const { state } = useRobot()
const mountEl    = ref(null)
const modelLoaded = ref(false)

// ─── Non-reactive Three.js objects ──────────────────────────────────────────
let renderer, camera, controls, animId

/**
 * bonesMap: keyed by jointConfigs[i].id
 *   Normal joint  → THREE.Object3D
 *   Claw joint    → { left: THREE.Object3D, right: THREE.Object3D }
 * initRot: the bone's world rotation at GLTF load time (baseline).
 * We ADD the slider radian to the baseline every frame.
 */
const bonesMap = {}

// ── Apply current state.angles to bones (called every frame) ─────────────────
// Reading directly from state (Vue reactive) in rAF is perfectly safe.
// This approach is immune to watcher timing / GLTF async-load race conditions:
// if boneRef isn't set yet, the if-guard silently skips; once the model loads,
// the very next frame picks up the correct angles automatically.
function applyAngles() {
  jointConfigs.forEach((cfg, i) => {
    const rad = state.angles[i]   // already in radians

    if (cfg.isClaw) {
      const pair = bonesMap[cfg.id]
      if (!pair) return
      if (pair.left) {
        pair.left.rotation[cfg.axis] =
          (pair.left.userData.initRot?.[cfg.axis] ?? 0) + rad
      }
      if (pair.right) {
        pair.right.rotation[cfg.axis] =
          (pair.right.userData.initRot?.[cfg.axis] ?? 0) + rad
      }
    } else {
      const bone = bonesMap[cfg.id]
      if (!bone) return
      bone.rotation[cfg.axis] =
        (bone.userData.initRot?.[cfg.axis] ?? 0) + rad
    }
  })
}

// ── onMounted: bootstrap Three.js scene ──────────────────────────────────────
onMounted(() => {
  const el = mountEl.value

  // Scene ────────────────────────────────────────────────────────────────────
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0d1117)
  scene.fog = new THREE.Fog(0x0d1117, 20, 60)

  // Grid ─────────────────────────────────────────────────────────────────────
  const grid = new THREE.GridHelper(16, 24, 0x1e3a5f, 0x131e2e)
  scene.add(grid)

  // Camera ───────────────────────────────────────────────────────────────────
  camera = new THREE.PerspectiveCamera(
    50,
    el.clientWidth / el.clientHeight,
    0.1, 200
  )
  camera.position.set(0, 4, 10)

  // Renderer ─────────────────────────────────────────────────────────────────
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(el.clientWidth, el.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  el.appendChild(renderer.domElement)

  // Orbit controls ───────────────────────────────────────────────────────────
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance   = 3
  controls.maxDistance   = 30
  controls.target.set(0, 2, 0)
  controls.update()

  // Lights ───────────────────────────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0xffffff, 0.9)
  scene.add(ambient)

  const sun = new THREE.DirectionalLight(0xffffff, 2.0)
  sun.position.set(6, 12, 6)
  sun.castShadow = true
  sun.shadow.mapSize.width  = 1024
  sun.shadow.mapSize.height = 1024
  scene.add(sun)

  // Neon rim lights (blue + purple accent)
  const rimBlue   = new THREE.PointLight(0x38bdf8, 1.2, 25)
  rimBlue.position.set(-5, 8, -4)
  scene.add(rimBlue)

  const rimPurple = new THREE.PointLight(0xa855f7, 0.6, 20)
  rimPurple.position.set(5, 3, -6)
  scene.add(rimPurple)

  // Load GLTF ────────────────────────────────────────────────────────────────
  const loader = new GLTFLoader()
  loader.load(
    '/scene.gltf',

    // ── onLoad ──────────────────────────────────────────────────────────────
    (gltf) => {
      const robot = gltf.scene
      scene.add(robot)

      // Enable shadows on every mesh
      robot.traverse(node => {
        if (node.isMesh) {
          node.castShadow    = true
          node.receiveShadow = true
        }
      })

      // ── Populate bonesMap via traverse (more robust than getObjectByName) ──
      // First collect all named objects in a lookup table
      const byName = {}
      robot.traverse(node => {
        if (node.name) byName[node.name] = node
      })

      jointConfigs.forEach(cfg => {
        if (cfg.isClaw) {
          const left  = byName['arn007l_023'] ?? null
          const right = byName['arn007r_00']  ?? null
          bonesMap[cfg.id] = { left, right }

          if (left)  left.userData.initRot  = { x: left.rotation.x,  y: left.rotation.y,  z: left.rotation.z  }
          if (right) right.userData.initRot = { x: right.rotation.x, y: right.rotation.y, z: right.rotation.z }

          if (!left)  console.warn('[RobotViewer] Claw bone "arn007l_023" not found')
          if (!right) console.warn('[RobotViewer] Claw bone "arn007r_00" not found')
        } else {
          const bone = byName[cfg.id] ?? null
          if (bone) {
            bonesMap[cfg.id] = bone
            bone.userData.initRot = {
              x: bone.rotation.x,
              y: bone.rotation.y,
              z: bone.rotation.z,
            }
          } else {
            console.warn(`[RobotViewer] Bone "${cfg.id}" not found in GLTF. Available names:`,
              Object.keys(byName).slice(0, 30))
          }
        }
      })

      modelLoaded.value = true
    },

    // ── onProgress ──────────────────────────────────────────────────────────
    undefined,

    // ── onError ─────────────────────────────────────────────────────────────
    (err) => console.error('[RobotViewer] GLTF load error:', err)
  )

  // Resize observer ──────────────────────────────────────────────────────────
  const ro = new ResizeObserver(() => {
    if (!renderer) return
    const w = el.clientWidth
    const h = el.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  })
  ro.observe(el)

  // ── Render loop ────────────────────────────────────────────────────────────
  // applyAngles() is called EVERY frame — this is the key fix.
  // It reads state.angles directly; no watcher is needed.
  // The cost is negligible (5 float reads per frame).
  function animate() {
    animId = requestAnimationFrame(animate)
    applyAngles()           // ← reads state, updates bones
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Cleanup ──────────────────────────────────────────────────────────────────
  onUnmounted(() => {
    cancelAnimationFrame(animId)
    ro.disconnect()
    controls.dispose()
    renderer.dispose()
    if (el.contains(renderer.domElement)) {
      el.removeChild(renderer.domElement)
    }
  })
})
</script>

<style scoped>
.robot-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 14px;
  overflow: hidden;
  background: #0d1117;
}

/* Canvas fills the parent */
.robot-viewer :deep(canvas) {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
}

/* ── Loading overlay ── */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(10,13,20,0.85);
  backdrop-filter: blur(4px);
  color: #475569;
  font-size: 11px;
  letter-spacing: 0.06em;
  z-index: 20;
}
.spinner {
  width: 28px; height: 28px;
  border: 2px solid rgba(56,189,248,0.15);
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
