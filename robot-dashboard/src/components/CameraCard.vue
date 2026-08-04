<template>
  <div class="camera-card">
    <!-- Header -->
    <div class="cam-header">
      <div class="standby-dot"></div>
      <span class="cam-title">CAMERA X9</span>
      <span class="cam-info">4K · 60fps</span>
      <span class="cam-status">STANDBY</span>
    </div>

    <!-- Video viewport — static standby frame -->
    <div class="video-viewport">
      <div class="video-bg">
        <!-- Corner brackets -->
        <div class="bracket tl"></div>
        <div class="bracket tr"></div>
        <div class="bracket bl"></div>
        <div class="bracket br"></div>

        <!-- Static crosshair -->
        <div class="crosshair">
          <div class="ch-h"></div>
          <div class="ch-v"></div>
          <div class="ch-center"></div>
        </div>

        <!-- Standby label -->
        <div class="standby-label">NO SIGNAL</div>
      </div>
    </div>

    <!-- LED Grid 4×6 — static standby (all dim) -->
    <div class="led-section">
      <div class="led-header">
        <span class="led-label">SENSOR ARRAY</span>
        <span class="led-count dim">0 / 24</span>
      </div>
      <div class="led-grid">
        <!--
          All 24 LEDs are dim/inactive.
          Color class is preserved for quick backend-driven activation.
          No setInterval, no Math.random().
        -->
        <div v-for="(led, i) in LEDS" :key="i" class="led" :class="led.color"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Static LED configuration — 4 rows × 6 cols = 24 sensors.
// All inactive until backend activates them.
// Color class indicates the intended signal type when active.
const LEDS = [
  ...Array(6).fill({ color: 'green'  }),
  ...Array(6).fill({ color: 'yellow' }),
  ...Array(6).fill({ color: 'green'  }),
  ...Array(6).fill({ color: 'red'    }),
]

// No setInterval, no Math.random(), no onMounted timer.
</script>

<style scoped>
.camera-card {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Header ── */
.cam-header {
  display: flex; align-items: center; gap: 7px;
}
.standby-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #334155;
  /* No animation — camera is off */
}
.cam-title  { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; }
.cam-info   { font-size: 9px; color: #334155; }
.cam-status {
  margin-left: auto;
  font-size: 9px; font-weight: 700; letter-spacing: 0.07em;
  color: #475569;
  background: rgba(71,85,105,0.12);
  border: 1px solid rgba(71,85,105,0.2);
  padding: 1px 7px; border-radius: 10px;
}

/* ── Video viewport ── */
.video-viewport {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
}
.video-bg {
  position: relative;
  height: 100px;
  background: #060c12;
  display: flex; align-items: center; justify-content: center;
}

/* Corner brackets */
.bracket {
  position: absolute;
  width: 12px; height: 12px;
  border-color: rgba(255,255,255,0.08);
  border-style: solid;
}
.bracket.tl { top: 5px;  left: 5px;  border-width: 1px 0 0 1px; }
.bracket.tr { top: 5px;  right: 5px; border-width: 1px 1px 0 0; }
.bracket.bl { bottom: 5px; left: 5px;  border-width: 0 0 1px 1px; }
.bracket.br { bottom: 5px; right: 5px; border-width: 0 1px 1px 0; }

/* Crosshair */
.crosshair { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.ch-h { position: absolute; width: 100%; height: 1px; background: rgba(255,255,255,0.05); }
.ch-v { position: absolute; height: 100%; width: 1px; background: rgba(255,255,255,0.05); }
.ch-center {
  width: 10px; height: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
}

.standby-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #1e293b;
  font-family: 'JetBrains Mono', monospace;
}

/* ── LED Grid ── */
.led-section { display: flex; flex-direction: column; gap: 5px; }
.led-header  { display: flex; align-items: center; justify-content: space-between; }
.led-label   { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; color: #334155; }
.led-count   { font-size: 9px; font-family: 'JetBrains Mono', monospace; color: #475569; }
.led-count.dim { color: #1e293b; }

.led-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
}

/* All LEDs dim — no glow, no box-shadow */
.led {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #1e293b;
  /* Color class preserved for backend-driven activation */
}
/* Future: .led.green.active { background:#22c55e; box-shadow: 0 0 6px #22c55e; } */
/* Future: .led.red.active   { background:#ef4444; box-shadow: 0 0 6px #ef4444; } */
/* Future: .led.yellow.active{ background:#eab308; box-shadow: 0 0 6px #eab308; } */
</style>
