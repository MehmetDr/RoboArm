<template>
  <div class="left-panel">
    <!-- Panel header -->
    <div class="panel-header">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="#38bdf8" stroke-width="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="#38bdf8" stroke-width="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="#64748b" stroke-width="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="#64748b" stroke-width="1.5"/>
      </svg>
      <span>MOTOR AXES</span>
      <span class="header-count">3 Active</span>
    </div>

    <!-- Axis Cards -->
    <div class="axes-list">
      <AxisCard
        name="Axis A — Shoulder"
        :joint-index="0"
        accent-color="#38bdf8"
        :base-temp="58"
        :base-rpm="1400"
        :base-torque="32"
        :max-rpm="3000"
        :max-torque="60"
      />
      <AxisCard
        name="Axis B — Elbow"
        :joint-index="1"
        accent-color="#a855f7"
        :base-temp="63"
        :base-rpm="980"
        :base-torque="41"
        :max-rpm="3000"
        :max-torque="60"
      />
      <AxisCard
        name="Axis C — Wrist"
        :joint-index="2"
        accent-color="#22c55e"
        :base-temp="49"
        :base-rpm="2100"
        :base-torque="18"
        :max-rpm="3000"
        :max-torque="60"
      />
    </div>

    <!-- Control Panel below axes -->
    <ControlPanel />
  </div>
</template>

<script setup>
import AxisCard from './AxisCard.vue'
import ControlPanel from './ControlPanel.vue'
</script>

<style scoped>
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 2px;
  min-height: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #475569;
}
.header-count {
  margin-left: auto;
  font-size: 9px;
  color: #22c55e;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  padding: 2px 7px;
  border-radius: 10px;
}

.axes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
