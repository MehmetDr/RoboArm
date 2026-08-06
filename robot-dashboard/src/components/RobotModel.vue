<template>
  <primitive :object="scene" />
</template>

<script setup>
import { defineEmits } from 'vue'
import { useGLTF } from '@tresjs/cientos'
import { useRenderLoop } from '@tresjs/core'
import { useRobot } from '../composables/useRobot.js'

const emit = defineEmits(['loaded'])

const { state, jointConfigs } = useRobot()

const { scene } = await useGLTF('/scene.gltf')

scene.traverse(node => {
  if (node.isMesh) {
    node.castShadow = true
    node.receiveShadow = true
  }
})

const byName = {}
scene.traverse(node => {
  if (node.name) byName[node.name] = node
})

const bonesMap = {}
jointConfigs.forEach(cfg => {
  if (cfg.isClaw) {
    const left = byName['arn007l_023'] ?? null
    const right = byName['arn007r_00'] ?? null
    bonesMap[cfg.id] = { left, right }
    if (left) left.userData.initRot = { x: left.rotation.x, y: left.rotation.y, z: left.rotation.z }
    if (right) right.userData.initRot = { x: right.rotation.x, y: right.rotation.y, z: right.rotation.z }
  } else {
    const bone = byName[cfg.id] ?? null
    if (bone) {
      bonesMap[cfg.id] = bone
      bone.userData.initRot = { x: bone.rotation.x, y: bone.rotation.y, z: bone.rotation.z }
    }
  }
})

// Emit event immediately after model processing is done
emit('loaded')

const { onLoop } = useRenderLoop()

onLoop(() => {
  jointConfigs.forEach((cfg, i) => {
    const rad = state.angles[i]
    if (cfg.isClaw) {
      const pair = bonesMap[cfg.id]
      if (!pair) return
      if (pair.left) pair.left.rotation[cfg.axis] = (pair.left.userData.initRot?.[cfg.axis] ?? 0) + rad
      if (pair.right) pair.right.rotation[cfg.axis] = (pair.right.userData.initRot?.[cfg.axis] ?? 0) + rad
    } else {
      const bone = bonesMap[cfg.id]
      if (!bone) return
      bone.rotation[cfg.axis] = (bone.userData.initRot?.[cfg.axis] ?? 0) + rad
    }
  })
})
</script>
