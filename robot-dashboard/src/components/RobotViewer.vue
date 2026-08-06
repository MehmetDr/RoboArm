<template>
  <div class="robot-viewer">
    <TresCanvas v-bind="gl">
      <TresPerspectiveCamera :position="[0, 4, 10]" :fov="50" :near="0.1" :far="200" />
      
      <OrbitControls :enable-damping="true" :damping-factor="0.08" :min-distance="3" :max-distance="30" :target="[0, 2, 0]" />
      
      <TresAmbientLight :color="0xffffff" :intensity="0.9" />
      <TresDirectionalLight :position="[6, 12, 6]" :color="0xffffff" :intensity="2.0" cast-shadow :shadow-mapSize-width="1024" :shadow-mapSize-height="1024" />
      <TresPointLight :position="[-5, 8, -4]" :color="0x38bdf8" :intensity="1.2" :distance="25" />
      <TresPointLight :position="[5, 3, -6]" :color="0xa855f7" :intensity="0.6" :distance="20" />
      
      <TresGridHelper :args="[16, 24, 0x1e3a5f, 0x131e2e]" />
      <TresFog :color="0x0d1117" :near="20" :far="60" />

      <Suspense>
        <RobotModel @loaded="onModelLoaded" />
      </Suspense>
    </TresCanvas>

    <!-- Loading overlay -->
    <div v-if="!modelLoaded" class="loading-overlay">
      <div class="spinner"></div>
      <span>Loading 3D Model…</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import RobotModel from './RobotModel.vue'

const modelLoaded = ref(false)

const gl = {
  clearColor: '#0d1117',
  shadows: true,
  alpha: false,
  antialias: true,
}

function onModelLoaded() {
  modelLoaded.value = true
}
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
  outline: none;
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
