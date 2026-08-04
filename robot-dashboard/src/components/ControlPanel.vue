<template>
  <div class="control-panel">
    <div class="cp-header">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#38bdf8" stroke-width="2"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
              stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>CONTROL PANEL</span>
      <div class="mode-badge">MANUAL</div>
    </div>

    <!-- ── J1 – J4 sliders ──────────────────────────────────────────────── -->
    <div class="joints-list">
      <div v-for="(cfg, i) in normalJoints" :key="cfg.id" class="joint-row">

        <div class="joint-label-row">
          <span class="joint-id">{{ JOINT_IDS[i] }}</span>
          <span class="joint-name">{{ shortLabel(cfg.label) }}</span>
          <!-- Live angle value driven by global state (number, not string) -->
          <span class="joint-deg">
            <span class="deg-val">{{ liveUiDeg(i) }}</span>
            <span class="deg-unit">°</span>
          </span>
        </div>

        <!--
          KEY FIX: use :value + @input (not v-model) to keep the number type.
          v-model on a range would give a string; we explicitly parseFloat here.
          The :value binding reflects the current radian state converted to UI degrees.
        -->
        <div class="slider-wrap">
          <input
            type="range"
            :min="cfg.uiMin"
            :max="cfg.uiMax"
            step="1"
            :value="liveUiDeg(i)"
            @input="onSlider(i, $event)"
            class="joint-slider"
            :style="sliderBg(liveUiDeg(i), cfg)"
          />
        </div>

        <div class="joint-meta">
          <span class="meta-item">{{ cfg.uiMin }}°</span>
          <div class="angle-arc">
            <svg width="32" height="16" viewBox="0 0 32 16">
              <path d="M1 15 A15 15 0 0 1 31 15" stroke="#1e293b" stroke-width="2" fill="none"/>
              <path :d="arcPath(liveUiDeg(i), cfg)"
                    stroke="#38bdf8" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="meta-item">{{ cfg.uiMax }}°</span>
        </div>

      </div>
    </div>

    <!-- ── Gripper ──────────────────────────────────────────────────────── -->
    <div class="gripper-section">
      <div class="gripper-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M18 11V6a2 2 0 0 0-4 0v0"    stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M14 10V4a2 2 0 0 0-4 0v2"    stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M10 10.5V6a2 2 0 0 0-4 0v8"  stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8H8A8 8 0 0 1 .07 15H0V9a2 2 0 0 1 4 0v3"
                stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="gripper-label">GRIPPER</span>
        <span class="gripper-state" :class="state.gripperOpen ? 'open' : 'closed'">
          {{ state.gripperOpen ? 'OPEN' : 'CLOSED' }}
        </span>
      </div>

      <div class="gripper-control">
        <!-- Visual jaw indicator -->
        <div class="gripper-visual">
          <div class="gripper-jaw left"  :class="{ open: state.gripperOpen }"></div>
          <div class="gripper-center">
            <div class="gripper-dot" :class="{ open: state.gripperOpen }"></div>
          </div>
          <div class="gripper-jaw right" :class="{ open: state.gripperOpen }"></div>
        </div>

        <!-- Toggle switch (CSS-animated, from global style.css) -->
        <label class="toggle-switch">
          <input
            type="checkbox"
            :checked="state.gripperOpen"
            @change="onGripper($event.target.checked)"
          />
          <span class="toggle-slider"></span>
        </label>

        <!-- Force readout -->
        <div class="force-display">
          <span class="f-label">FORCE</span>
          <span class="force-val">{{ state.gripperOpen ? '0.0' : '12.4' }}</span>
          <span class="f-unit">N</span>
        </div>
      </div>
    </div>

    <!-- ── Execute button ───────────────────────────────────────────────── -->
    <button class="execute-btn" @click="onExecute">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <polygon points="5,3 19,12 5,21" fill="#0a0d14"/>
      </svg>
      EXECUTE MOTION
    </button>

    <!-- ── DEV ONLY: Test Anomaly ────────────────────────────────────────── -->
    <button class="test-anomaly-btn" @click="sendTestAnomaly" title="Rastgele sahte anomali g\xF6nder">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M12 9v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
      TEST ANOMALY
      <span class="dev-tag">DEV</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRobot, jointConfigs, uiToRad, radToUi, addAnomaly } from '../composables/useRobot.js'

const { state, setAngle, toggleGripper } = useRobot()

// Only joints 0-3 are shown as sliders (J1-J4).
// Joint 4 (claw) is controlled by the gripper toggle below.
const normalJoints = jointConfigs.slice(0, 4)
const JOINT_IDS    = ['J1', 'J2', 'J3', 'J4']

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Shorten "J1 — Base Rotation" → "Base Rotation" */
function shortLabel(label) {
  return label.split('—')[1]?.trim() ?? label
}

/**
 * Current UI degrees for joint i (converted from stored radians).
 * Returns a plain number — no toFixed to avoid jumpy slider behaviour.
 */
function liveUiDeg(i) {
  return parseFloat(radToUi(state.angles[i], normalJoints[i]).toFixed(2))
}

// ── Event handlers ────────────────────────────────────────────────────────────

/**
 * Slider moved → convert UI degrees to radians → write to global state.
 * parseFloat() guarantees a number (not a string from event.target.value).
 */
function onSlider(i, event) {
  const uiDeg = parseFloat(event.target.value)   // always a Number
  const rad   = uiToRad(uiDeg, normalJoints[i])  // convert to Three.js radians
  setAngle(i, rad)                                // splice() into reactive array
}

function onGripper(open) {
  toggleGripper(open)
}

function onExecute() {
  // Visual pulse feedback
  const btn = document.querySelector('.execute-btn')
  if (!btn) return
  btn.classList.add('firing')
  setTimeout(() => btn.classList.remove('firing'), 600)
}

// ── Styling helpers ───────────────────────────────────────────────────────────

/** Fills slider track proportionally from uiMin to current value. */
function sliderBg(uiVal, cfg) {
  const pct = Math.max(0, Math.min(100,
    ((uiVal - cfg.uiMin) / (cfg.uiMax - cfg.uiMin)) * 100
  ))
  return {
    background:
      `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${pct}%, #1e293b ${pct}%, #1e293b 100%)`
  }
}

/** Mini arc SVG path that sweeps proportionally to the current angle. */
function arcPath(uiVal, cfg) {
  const t     = Math.max(0, Math.min(1, (uiVal - cfg.uiMin) / (cfg.uiMax - cfg.uiMin)))
  const angle = t * Math.PI
  const x     = 1 + 15 * (1 - Math.cos(angle))
  const y     = 15 - 15 * Math.sin(angle)
  return `M1 15 A15 15 0 0 1 ${x.toFixed(3)} ${y.toFixed(3)}`
}

// ── DEV: Test Anomaly ─────────────────────────────────────────────────────────

const TEST_SCENARIOS = [
  { axis: 'J1', type: 'Overcurrent',  severity: 'WARNING',  message: '14.2 A / limit 12 A' },
  { axis: 'J2', type: 'Temp High',    severity: 'WARNING',  message: '63.4°C / limit 60°C' },
  { axis: 'J3', type: 'Overload',     severity: 'CRITICAL', message: '98% rated torque'     },
  { axis: 'J3', type: 'Vibration',    severity: 'WARNING',  message: '4.2 mm/s²'            },
  { axis: 'J4', type: 'Encoder Slip', severity: 'CRITICAL', message: 'Delta 0.8° detected'  },
  { axis: 'J5', type: 'Force Spike',  severity: 'WARNING',  message: 'Grip force 18.3 N'    },
]

let _devCounter = 1

/**
 * DEV ONLY — “Test Anomaly” butonuna basılınca çağrılır.
 * Rastgele bir senaryo seçer ve addAnomaly() ile state’e gönderir.
 */
function sendTestAnomaly() {
  const scenario = TEST_SCENARIOS[Math.floor(Math.random() * TEST_SCENARIOS.length)]
  addAnomaly({
    id:        `dev-${_devCounter++}-${Date.now()}`,
    timestamp: new Date(),
    axis:      scenario.axis,
    type:      scenario.type,
    severity:  scenario.severity,
    message:   scenario.message,
  })
}
</script>

<style scoped>
.control-panel {
  background: #111827;
  border: 1px solid rgba(56,189,248,0.12);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Header ── */
.cp-header {
  display: flex; align-items: center; gap: 8px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #475569;
}
.mode-badge {
  margin-left: auto;
  font-size: 9px; font-weight: 700; letter-spacing: 0.06em; color: #38bdf8;
  background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25);
  padding: 2px 8px; border-radius: 10px;
}

/* ── Joint rows ── */
.joints-list { display: flex; flex-direction: column; gap: 8px; }
.joint-row   { display: flex; flex-direction: column; gap: 3px; }

.joint-label-row { display: flex; align-items: center; gap: 6px; }

.joint-id {
  font-size: 10px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
  color: #38bdf8;
  background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2);
  padding: 1px 5px; border-radius: 4px; min-width: 22px; text-align: center;
}
.joint-name { font-size: 11px; color: #64748b; flex: 1; overflow: hidden; white-space: nowrap; }
.joint-deg  { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; }
.deg-val    { color: #38bdf8; }
.deg-unit   { color: #475569; font-size: 10px; }

.slider-wrap  { width: 100%; }
.joint-slider { width: 100%; }

.joint-meta { display: flex; align-items: center; justify-content: space-between; }
.meta-item  { font-size: 9px; color: #334155; font-family: 'JetBrains Mono', monospace; }
.angle-arc  { display: flex; align-items: center; }

/* ── Gripper ── */
.gripper-section {
  background: #0d1117; border: 1px solid rgba(255,255,255,0.05);
  border-radius: 10px; padding: 10px;
  display: flex; flex-direction: column; gap: 8px;
}
.gripper-header {
  display: flex; align-items: center; gap: 7px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.08em; color: #475569;
}
.gripper-label { color: #64748b; }
.gripper-state {
  margin-left: auto;
  font-size: 9px; font-weight: 700; letter-spacing: 0.06em;
  padding: 2px 7px; border-radius: 10px; transition: all 0.3s;
}
.gripper-state.open   { color: #22c55e; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); }
.gripper-state.closed { color: #ef4444; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); }

.gripper-control { display: flex; align-items: center; gap: 12px; }

.gripper-visual { display: flex; align-items: center; gap: 2px; }
.gripper-jaw { width: 6px; height: 22px; background: #334155; border-radius: 3px; transition: all 0.4s ease; }
.gripper-jaw.left.open  { transform: translateX(-5px); background: #38bdf8; }
.gripper-jaw.right.open { transform: translateX(5px);  background: #38bdf8; }
.gripper-center { width: 8px; display: flex; justify-content: center; }
.gripper-dot {
  width: 5px; height: 5px; border-radius: 50%; background: #475569; transition: all 0.4s;
}
.gripper-dot.open { background: #38bdf8; box-shadow: 0 0 6px #38bdf8; }

.force-display { display: flex; align-items: baseline; gap: 2px; }
.f-label  { font-size: 9px; font-weight: 600; letter-spacing: 0.08em; color: #334155; margin-right: 3px; }
.force-val { font-size: 14px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #94a3b8; }
.f-unit   { font-size: 10px; color: #475569; }

/* ── Execute ── */
.execute-btn {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  width: 100%; padding: 9px;
  background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.3);
  border-radius: 8px; color: #38bdf8;
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
  cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
}
.execute-btn:hover         { background: rgba(56,189,248,0.2); border-color: rgba(56,189,248,0.5); box-shadow: 0 0 16px rgba(56,189,248,0.2); }
.execute-btn:active        { transform: scale(0.98); }
.execute-btn.firing        { background: rgba(56,189,248,0.35); transform: scale(0.97); }

/* ── DEV: Test Anomaly butonu ── */
.test-anomaly-btn {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: 100%; padding: 7px;
  background: rgba(249,115,22,0.07);
  border: 1px dashed rgba(249,115,22,0.35);
  border-radius: 8px; color: #f97316;
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
  cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
}
.test-anomaly-btn:hover {
  background: rgba(249,115,22,0.14);
  border-color: rgba(249,115,22,0.6);
  box-shadow: 0 0 12px rgba(249,115,22,0.2);
}
.test-anomaly-btn:active { transform: scale(0.97); }

.dev-tag {
  font-size: 7px; font-weight: 800; letter-spacing: 0.1em;
  color: #0a0d14; background: #f97316;
  padding: 1px 4px; border-radius: 3px;
  margin-left: 2px;
}
</style>
