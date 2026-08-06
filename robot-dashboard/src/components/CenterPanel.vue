<template>
  <div class="center-panel">
    <!-- Panel header -->
    <div class="panel-header">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#38bdf8" stroke-width="1.5"/>
        <path d="M12 8v4l3 3" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>ROBOT ARM — UR-10e #003</span>
      <div class="header-status">
        <div class="status-dot"></div>
        <span>RUNNING</span>
      </div>
    </div>

    <!-- 3D Viewport with badge overlays -->
    <div class="robot-workspace">
      <!-- Three.js 3D viewer fills the whole card -->
      <RobotViewer class="three-canvas" />

      <!-- Joint angle HUD (reads global state) -->
      <div class="joint-hud">
        <div v-for="(cfg, i) in jointConfigs" :key="cfg.id" class="hud-joint">
          <span class="hj-id">{{ hudIds[i] }}</span>
          <span class="hj-val">{{ hudDeg(i) }}<span class="hj-unit">°</span></span>
        </div>
      </div>

      <!-- AI Anomaly Detection — Dynamic HUD Badges -->
      <!-- severity=WARNING → turuncu + yavaş pulse; CRITICAL → kırmızı + hızlı pulse -->
      <template v-for="anomaly in state.anomalies" :key="anomaly.id">
        <div
          v-if="hudPositions[anomaly.axis]"
          class="badge anomaly-badge"
          :class="anomaly.severity === 'CRITICAL' ? 'anomaly-critical' : 'anomaly-warning'"
          :style="hudPositions[anomaly.axis]"
        >
          <div class="badge-icon">{{ anomaly.severity === 'CRITICAL' ? '✕' : '⚠' }}</div>
          <div class="badge-content">
            <div class="badge-title">{{ anomaly.severity }}</div>
            <div class="badge-msg">{{ anomaly.axis }} {{ anomaly.type }}</div>
            <div class="badge-val">{{ anomaly.message }}</div>
          </div>
        </div>
      </template>

      <!-- Static OK badge — Gripper status -->
      <div class="badge ok" style="top:8%; left:8%;">
        <div class="badge-icon ok-icon">✓</div>
        <div class="badge-content">
          <div class="badge-title" style="color:#22c55e">OK</div>
          <div class="badge-msg">Gripper</div>
          <div class="badge-val">{{ state.gripperOpen ? 'Open' : 'Closed' }}</div>
        </div>
      </div>

      <!-- Bottom HUD metrics -->
      <div class="hud-metrics">
        <div class="hud-metric">
          <span class="hm-label">PAYLOAD</span>
          <span class="hm-val">{{ payload }}</span>
          <span class="hm-unit">kg</span>
        </div>
        <div class="hud-divider"></div>
        <div class="hud-metric">
          <span class="hm-label">REACH</span>
          <span class="hm-val">1142</span>
          <span class="hm-unit">mm</span>
        </div>
        <div class="hud-divider"></div>
        <div class="hud-metric">
          <span class="hm-label">TCP SPEED</span>
          <span class="hm-val" style="color:#22c55e">{{ tcpSpeed }}</span>
          <span class="hm-unit">mm/s</span>
        </div>
        <div class="hud-divider"></div>
        <div class="hud-metric">
          <span class="hm-label">PROGRAM</span>
          <span class="hm-val" style="color:#38bdf8; font-size:10px;">PICK_PLACE_04</span>
        </div>
      </div>
    </div>

    <!-- AI Terminal — feeds from state.aiLogs -->
    <AiTerminal />

    <!-- Alarm Log — feeds from state.anomalies -->
    <AlarmLog />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RobotViewer from './RobotViewer.vue'
import AlarmLog   from './AlarmLog.vue'
import AiTerminal from './AiTerminal.vue'
import { useRobot, radToUi, jointConfigs } from '../composables/useRobot.js'

const { state } = useRobot()

const hudIds = ['J1', 'J2', 'J3', 'J4', 'J5']

/** Convert stored radian → display degrees (uses updated helper name) */
function hudDeg(i) {
  return parseFloat(radToUi(state.angles[i], jointConfigs[i]).toFixed(1))
}

// Static placeholders — no Math.random(), no setInterval.
// payload and tcpSpeed will be populated by the backend.
const payload  = ref('--')
const tcpSpeed = ref('--')

/**
 * Axis → absolute CSS position map for HUD anomaly badges.
 * J1=base(bottom-center), J2=shoulder(left-mid), J3=elbow(center),
 * J4=wrist(right-high), J5=gripper(right-low)
 * Tüm değerleri kendi 3D görünümüne göre ayarlayabilirsin.
 */
const hudPositions = {
  J1: { bottom: '18%', left:  '44%' },
  J2: { top:    '55%', left:  '12%' },
  J3: { top:    '38%', left:  '38%' },
  J4: { top:    '22%', left:  '60%' },
  J5: { top:    '65%', left:  '62%' },
}
</script>

<style scoped>
.center-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow: hidden;
}

/* ── Header ── */
.panel-header {
  display: flex; align-items: center; gap: 8px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #475569; flex-shrink: 0;
}
.header-status {
  margin-left: auto;
  display: flex; align-items: center; gap: 5px;
  font-size: 9px; font-weight: 700; color: #22c55e;
  background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
  padding: 2px 8px; border-radius: 10px;
}
.status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #22c55e; box-shadow: 0 0 5px #22c55e;
  animation: blink 1.8s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* ── Workspace ── */
.robot-workspace {
  flex: 1; min-height: 0;
  position: relative;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
}
.three-canvas { flex: 1; }

/* ── Joint HUD (top-right corner) ── */
.joint-hud {
  position: absolute; top: 10px; right: 10px; z-index: 10;
  display: flex; flex-direction: column; gap: 3px;
  background: rgba(10,13,20,0.75);
  border: 1px solid rgba(56,189,248,0.12);
  border-radius: 8px; padding: 6px 10px;
  backdrop-filter: blur(4px);
}
.hud-joint { display: flex; align-items: center; gap: 6px; }
.hj-id {
  font-size: 9px; font-weight: 700;
  font-family: 'JetBrains Mono', monospace; color: #38bdf8; min-width: 20px;
}
.hj-val {
  font-size: 11px; font-weight: 600;
  font-family: 'JetBrains Mono', monospace; color: #cbd5e1;
}
.hj-unit { font-size: 8px; color: #475569; }

/* ── Badges ── */
.badge {
  position: absolute; z-index: 10;
  display: flex; align-items: center; gap: 6px;
  padding: 6px 9px; border-radius: 8px;
  animation: badgePulse 2s ease-in-out infinite;
  pointer-events: none;
}
.badge.warning { background: rgba(234,179,8,0.12); border: 1px solid rgba(234,179,8,0.4); }
.badge.error   { background: rgba(239,68,68,0.12);  border: 1px solid rgba(239,68,68,0.4);  }
.badge.ok      { background: rgba(34,197,94,0.08);  border: 1px solid rgba(34,197,94,0.3);  }
.badge-icon    { font-size: 12px; color: #eab308; font-weight: 700; line-height: 1; }
.badge.error .badge-icon { color: #ef4444; }
.badge.ok .ok-icon       { color: #22c55e; font-size: 13px; }
.badge-content { display: flex; flex-direction: column; gap: 1px; }
.badge-title   { font-size: 8px; font-weight: 800; letter-spacing: 0.1em; color: #eab308; }
.badge.error .badge-title { color: #ef4444; }
.badge-msg     { font-size: 10px; font-weight: 600; color: #e2e8f0; }
.badge-val     { font-size: 9px; font-family: 'JetBrains Mono', monospace; color: #94a3b8; }
/* ── Anomaly Badge variants ── */
/* WARNING: turuncu + yavaş pulse (2s) */
.anomaly-warning {
  background: rgba(249,115,22,0.13);
  border: 1px solid rgba(249,115,22,0.5);
  animation: badgePulseWarning 2s ease-in-out infinite;
}
.anomaly-warning .badge-icon  { color: #f97316; }
.anomaly-warning .badge-title { color: #f97316; }

/* CRITICAL: kırmızı + hızlı pulse (0.8s) */
.anomaly-critical {
  background: rgba(220,38,38,0.15);
  border: 1px solid rgba(220,38,38,0.6);
  animation: badgePulseCritical 0.8s ease-in-out infinite;
}
.anomaly-critical .badge-icon  { color: #dc2626; }
.anomaly-critical .badge-title { color: #dc2626; }

@keyframes badgePulseWarning {
  0%,100% { transform: scale(1);    opacity: 1;   box-shadow: none; }
  50%     { transform: scale(1.04); opacity: 0.88; box-shadow: 0 0 12px rgba(249,115,22,0.35); }
}
@keyframes badgePulseCritical {
  0%,100% { transform: scale(1);    opacity: 1;   box-shadow: 0 0 8px  rgba(220,38,38,0.5); }
  50%     { transform: scale(1.06); opacity: 0.85; box-shadow: 0 0 20px rgba(220,38,38,0.8); }
}

/* ── Bottom HUD ── */
.hud-metrics {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 5;
  display: flex; align-items: center;
  padding: 8px 16px;
  background: linear-gradient(to top, rgba(10,13,20,0.95), transparent);
}
.hud-metric { display: flex; align-items: baseline; gap: 4px; padding: 0 12px; }
.hud-divider { width: 1px; height: 20px; background: rgba(255,255,255,0.07); }
.hm-label { font-size: 8px; font-weight: 700; letter-spacing: 0.08em; color: #334155; }
.hm-val   { font-size: 14px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #94a3b8; }
.hm-unit  { font-size: 9px; color: #334155; }

/* ── Alarm log ── */
.alarm-log {
  background: #111827; border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px; padding: 10px 12px; flex-shrink: 0;
}
.alarm-header {
  display: flex; align-items: center; gap: 7px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #475569;
  margin-bottom: 8px;
}
.alarm-count {
  margin-left: auto; font-size: 9px; font-weight: 700; color: #eab308;
  background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.25);
  padding: 1px 7px; border-radius: 10px;
}
.alarm-list { display: flex; flex-direction: column; gap: 5px; }
.alarm-item {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 8px; border-radius: 6px; background: rgba(255,255,255,0.02);
}
.alarm-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.alarm-dot.error   { background: #ef4444; box-shadow: 0 0 5px #ef4444; }
.alarm-dot.warning { background: #eab308; box-shadow: 0 0 5px #eab308; }
.alarm-dot.info    { background: #38bdf8; box-shadow: 0 0 5px #38bdf8; }
.alarm-body { display: flex; gap: 8px; align-items: center; flex: 1; }
.alarm-code { font-size: 9px; font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #475569; min-width: 68px; }
.alarm-desc { font-size: 10px; color: #64748b; }
.alarm-time { font-size: 9px; font-family: 'JetBrains Mono', monospace; color: #334155; margin-left: auto; }
</style>
