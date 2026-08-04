/**
 * useRobot.js — Global singleton reactive state for the robot arm.
 *
 * Single source of truth:
 *   - ControlPanel.vue  → writes (slider / gripper inputs)
 *   - RobotViewer.vue   → reads  (drives Three.js bone rotations each frame)
 *   - AxisCard.vue      → reads  (displays live joint angle, NOT random)
 *
 * Chart/motor-health intervals (TorqueChart, SpeedChart, AxisCard temp/rpm/torque)
 * are completely independent and are NOT affected here.
 */

import { reactive } from 'vue'

// ── Joint configuration (exported at module level — one array for all consumers) ──
export const jointConfigs = [
  {
    id:     'Bone_01',
    label:  'J1 — Base Rotation',
    axis:   'y',
    isClaw: false,
    uiMin:  -180, uiMax: 180,    // degrees shown on the UI slider
    threeMin: -3.14159, threeMax: 3.14159,  // radians for Three.js
  },
  {
    id:     'Bone001_02',
    label:  'J2 — Shoulder',
    axis:   'y',
    isClaw: false,
    uiMin:  -90,  uiMax: 90,
    threeMin: -1.5708, threeMax: 1.5708,
  },
  {
    id:     'Bone002_03',
    label:  'J3 — Elbow',
    axis:   'y',
    isClaw: false,
    uiMin:  -120, uiMax: 120,
    threeMin: -2.0944, threeMax: 2.0944,
  },
  {
    id:     'Bone004_05',
    label:  'J4 — Wrist Roll',
    axis:   'y',
    isClaw: false,
    uiMin:  -180, uiMax: 180,
    threeMin: -3.14159, threeMax: 3.14159,
  },
  {
    id:     'CLAW_GROUP',
    label:  'J5 — Gripper',
    axis:   'x',
    isClaw: true,
    uiMin:  -0.8, uiMax: 0.0,
    threeMin: -0.8, threeMax: 0.0,
  },
]

// ── Reactive state (module-level singleton — survives hot-reload) ──────────────
// angles[] values are in RADIANS (Three.js native unit).
// Each index maps 1-to-1 with jointConfigs.
const state = reactive({
  angles:      [0, 0, 0, 0, 0],
  gripperOpen: false,
  /**
   * AI Anomaly Detection — backend push events land here.
   * Shape: { id, timestamp, axis, type, severity ('WARNING'|'CRITICAL'), message }
   */
  anomalies: [],
})

// ── Unit conversion helpers ───────────────────────────────────────────────────

/**
 * UI degrees → Three.js radians (linear interpolation across the joint range).
 * Works for normal joints AND the claw (which is already in radians on both ends).
 */
export function uiToRad(uiDeg, cfg) {
  const t = (uiDeg - cfg.uiMin) / (cfg.uiMax - cfg.uiMin)
  return cfg.threeMin + t * (cfg.threeMax - cfg.threeMin)
}

/**
 * Three.js radians → UI degrees (inverse of uiToRad).
 */
export function radToUi(rad, cfg) {
  const t = (rad - cfg.threeMin) / (cfg.threeMax - cfg.threeMin)
  return cfg.uiMin + t * (cfg.uiMax - cfg.uiMin)
}

// ── Mutation helpers ──────────────────────────────────────────────────────────

/**
 * Set joint angle in radians.
 * Uses splice() to guarantee Vue 3 tracks the array-item mutation.
 */
export function setAngle(index, radValue) {
  state.angles.splice(index, 1, radValue)
}

/**
 * Toggle the gripper and sync the claw bone angle.
 * open=true  → angle 0    (jaws open)
 * open=false → angle -0.8 (jaws closed)
 */
export function toggleGripper(open) {
  state.gripperOpen = open
  state.angles.splice(4, 1, open ? 0 : -0.8)
}

/**
 * Push a new anomaly event into the reactive state.
 * Payload: { id, timestamp, axis, type, severity ('WARNING'|'CRITICAL'), message }
 * The UI (CenterPanel HUD badges, AlarmLog) reacts automatically.
 */
export function addAnomaly(payload) {
  state.anomalies.unshift(payload) // newest first
}

/**
 * WebSocket bağlantısı için taslak — gerçek mantığı sen dolduracaksın.
 * Örnek: ws.onmessage = (e) => addAnomaly(JSON.parse(e.data))
 */
export function initWebSocket() {
  console.log('WebSocket bağlantısı bekleniyor...')
}

// ── Composable entry point ────────────────────────────────────────────────────
export function useRobot() {
  return { state, jointConfigs, setAngle, toggleGripper, uiToRad, radToUi, addAnomaly, initWebSocket }
}
