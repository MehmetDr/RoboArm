<template>
  <div class="speed-card">
    <div class="chart-header">
      <div class="chart-title-row">
        <div class="color-dot green"></div>
        <span class="chart-title">SPEED</span>
        <span class="chart-unit">mm/s</span>
      </div>
      <div class="live-val">
        <span class="val-num" style="color:#22c55e">--</span>
        <span class="val-unit">mm/s</span>
      </div>
    </div>

    <div class="chart-wrap">
      <div class="no-data-overlay">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"
                    stroke="#22c55e" stroke-width="1.5"
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

// Static flatline — no setInterval, no Math.random()
const POINTS = 20
const labels = Array.from({ length: POINTS }, (_, i) => i.toString())
const data   = Array(POINTS).fill(0)

const chartData = {
  labels,
  datasets: [{
    data,
    borderColor: 'rgba(34,197,94,0.35)',
    borderWidth: 1.5,
    pointRadius: 0,
    tension: 0,
    fill: true,
    backgroundColor: 'rgba(34,197,94,0.04)',
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
      min: -20, max: 400,
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
.speed-card {
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
.color-dot.green {
  background: rgba(34,197,94,0.4);
  box-shadow: 0 0 4px rgba(34,197,94,0.3);
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
