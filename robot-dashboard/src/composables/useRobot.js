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

import { useRobotStore } from '../store/robotStore.js'

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

// (State moved to Pinia store: robotStore.js)

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

// Mutation helpers are now in the Pinia store. We will proxy them through the useRobot composable.

/**
 * WebSocket bağlantısı için taslak — gerçek mantığı sen dolduracaksın.
 * Örnek: ws.onmessage = (e) => addAnomaly(JSON.parse(e.data))
 */
export function initWebSocket() {
  console.log('WebSocket bağlantısı bekleniyor...')
}

// ── Composable entry point ────────────────────────────────────────────────────
export function useRobot() {
  const store = useRobotStore()
  
  return { 
    state: store, 
    jointConfigs, 
    setAngle: store.setAngle, 
    toggleGripper: store.toggleGripper, 
    uiToRad, 
    radToUi, 
    addAnomaly: store.addAnomaly, 
    homePosition: store.homePosition,
    executeTask: store.executeTask,
    initWebSocket 
  }
}
