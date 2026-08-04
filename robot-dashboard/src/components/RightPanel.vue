<template>
  <div class="right-panel">
    <!-- Panel header -->
    <div class="panel-header">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>ANALYTICS</span>
    </div>

    <!-- Torque Chart -->
    <TorqueChart />

    <!-- Camera X9 -->
    <CameraCard />

    <!-- Speed Chart -->
    <SpeedChart />
  </div>
</template>

<script setup>
import TorqueChart from './TorqueChart.vue'
import SpeedChart  from './SpeedChart.vue'
import CameraCard  from './CameraCard.vue'
</script>

<style scoped>
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 2px;
  min-height: 0;
}
/* Make charts fill equal space */
.right-panel > :nth-child(2),
.right-panel > :nth-child(4) {
  flex: 1;
  min-height: 120px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #475569;
  flex-shrink: 0;
}
</style>
