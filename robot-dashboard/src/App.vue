<template>
  <div class="app-root">
    <!-- Top Header Bar -->
    <header class="header-bar">
      <div class="header-left">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#38bdf8" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="#38bdf8" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="#38bdf8" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="header-title">ROBOARM <span class="header-subtitle">Control System</span></span>
        <span class="version-badge">v4.2.1</span>
      </div>
      <div class="header-center">
        <div class="status-dot online"></div>
        <span class="status-text">ONLINE</span>
        <span class="divider">|</span>
        <span class="status-text muted">Robot UR-10e #003</span>
      </div>
      <div class="header-right">
        <div class="header-metric">
          <span class="metric-label">CYCLE TIME</span>
          <span class="metric-val dim">--</span>
        </div>
        <div class="header-metric">
          <span class="metric-label">UPTIME</span>
          <span class="metric-val dim">--</span>
        </div>
        <div class="header-metric">
          <span class="metric-label">SYS TEMP</span>
          <span class="metric-val dim">--</span>
        </div>
        <div class="time-display">{{ currentTime }}</div>
      </div>
    </header>

    <!-- Main 3-Column Grid -->
    <main class="main-grid">
      <LeftPanel />
      <CenterPanel />
      <RightPanel />
    </main>
  </div>
</template>

<script setup>
// Clock reads real system time — NOT Math.random(), kept intentionally.
import { ref, onMounted, onUnmounted } from 'vue'
import LeftPanel  from './components/LeftPanel.vue'
import CenterPanel from './components/CenterPanel.vue'
import RightPanel from './components/RightPanel.vue'

const currentTime = ref('')
let clockTimer = null

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('tr-TR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
})

onUnmounted(() => clearInterval(clockTimer))
</script>

<style scoped>
.app-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0a0d14;
  overflow: hidden;
}

/* ─── Header ─── */
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 52px;
  background: #0d1117;
  border-bottom: 1px solid rgba(56,189,248,0.12);
  flex-shrink: 0;
  gap: 16px;
}
.header-left  { display: flex; align-items: center; gap: 10px; }
.header-center{ display: flex; align-items: center; gap: 8px; }
.header-right { display: flex; align-items: center; gap: 16px; }

.logo-icon {
  width: 32px; height: 32px;
  background: rgba(56,189,248,0.1);
  border: 1px solid rgba(56,189,248,0.3);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.header-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #f1f5f9;
}
.header-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: #64748b;
  margin-left: 4px;
  letter-spacing: 0.04em;
}
.version-badge {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: #38bdf8;
  background: rgba(56,189,248,0.08);
  border: 1px solid rgba(56,189,248,0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
}
.status-dot.online {
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.4; }
}
.status-text { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; color: #94a3b8; }
.status-text.muted { color: #475569; font-weight: 400; }
.divider { color: #1e293b; font-size: 14px; }

.header-metric { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
.metric-label  { font-size: 9px; font-weight: 600; letter-spacing: 0.08em; color: #475569; }
.metric-val      { font-size: 13px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #cbd5e1; }
.metric-val.warn { color: #eab308; }
.metric-val.dim  { color: #334155; font-weight: 500; }

.time-display {
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  color: #38bdf8;
  background: rgba(56,189,248,0.06);
  border: 1px solid rgba(56,189,248,0.15);
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.04em;
}

/* ─── Main Grid ─── */
.main-grid {
  display: grid;
  grid-template-columns: 290px 1fr 330px;
  gap: 12px;
  padding: 12px;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}
</style>
