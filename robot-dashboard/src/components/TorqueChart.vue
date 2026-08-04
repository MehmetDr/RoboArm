<template>
  <div class="torque-card">
    <div class="chart-header">
      <div class="chart-title-row">
        <div class="color-dot purple"></div>
        <span class="chart-title">TORQUE</span>
        <span class="chart-unit">Nm</span>
      </div>
      <div class="live-val">
        <span class="val-num" style="color:#a855f7">--</span>
        <span class="val-unit">Nm</span>
      </div>
    </div>

    <!-- Flatline "waiting for data" state -->
    <div class="chart-wrap">
      <div class="no-data-overlay">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"
                    stroke="#a855f7" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Awaiting data stream</span>
      </div>
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

// Static flatline — 20 zero points, no setInterval, no Math.random()
const POINTS = 20
const labels = Array.from({ length: POINTS }, (_, i) => i.toString())
const data   = Array(POINTS).fill(0)

const chartData = {
  labels,
  datasets: [{
    data,
    borderColor: 'rgba(168,85,247,0.35)',
    borderWidth: 1.5,
    pointRadius: 0,
    tension: 0,
    fill: false,
  }],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { display: false },
    y: {
      min: -5, max: 55,
      grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
      ticks: {
        color: '#1e293b',
        font: { size: 9, family: 'JetBrains Mono' },
        maxTicksLimit: 4,
      },
    },
  },
}
</script>

<style scoped>
.torque-card {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chart-title-row { display: flex; align-items: center; gap: 6px; }
.color-dot       { width: 7px; height: 7px; border-radius: 50%; }
.color-dot.purple {
  background: rgba(168,85,247,0.4);
  box-shadow: 0 0 4px rgba(168,85,247,0.3);
}
.chart-title { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; }
.chart-unit  { font-size: 9px; color: #334155; }

.live-val { display: flex; align-items: baseline; gap: 3px; }
.val-num  {
  font-size: 16px; font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  opacity: 0.4;
}
.val-unit { font-size: 10px; color: #334155; }

/* chart area */
.chart-wrap {
  flex: 1; min-height: 0;
  position: relative;
}
.no-data-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #334155;
  pointer-events: none;
  z-index: 2;
}
</style>
