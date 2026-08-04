<template>
  <div class="axis-card">
    <!-- Header -->
    <div class="axis-header">
      <div class="axis-icon" :style="{ borderColor: accentColor, background: `${accentColor}18` }">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" :stroke="accentColor" stroke-width="2"/>
          <path
            d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
            :stroke="accentColor" stroke-width="1.5" stroke-linecap="round"
          />
        </svg>
      </div>
      <div>
        <div class="axis-name">{{ name }}</div>
        <div class="axis-type">Servo Motor · {{ jointLabel }}</div>
      </div>
      <!-- Status: STANDBY until backend sends data -->
      <div class="status-pill standby">STANDBY</div>
    </div>

    <!-- Joint angle row — sourced from global robot state (slider), NOT random -->
    <div class="angle-row">
      <span class="ar-label">JOINT ANGLE</span>
      <div class="angle-track">
        <div
          class="angle-fill"
          :style="{
            width: `${anglePct}%`,
            background: `linear-gradient(90deg, ${accentColor}66, ${accentColor})`
          }"
        ></div>
      </div>
      <span class="ar-val" :style="{ color: accentColor }">
        {{ angleDisplay }}<span class="ar-unit">°</span>
      </span>
    </div>

    <!-- Motor health metrics — static, awaiting backend -->
    <div class="metrics-row">
      <div class="metric-block">
        <div class="metric-label">TEMP</div>
        <div class="metric-value dim">--<span class="unit">°C</span></div>
        <div class="mini-bar-track"><div class="mini-bar-fill" style="width:0%"></div></div>
      </div>

      <div class="metric-block">
        <div class="metric-label">RPM</div>
        <div class="metric-value dim">--<span class="unit">r/m</span></div>
        <div class="mini-bar-track"><div class="mini-bar-fill" style="width:0%; background:#38bdf8"></div></div>
      </div>

      <div class="metric-block">
        <div class="metric-label">TORQUE</div>
        <div class="metric-value dim">--<span class="unit">Nm</span></div>
        <div class="mini-bar-track"><div class="mini-bar-fill" style="width:0%; background:#a855f7"></div></div>
      </div>
    </div>

    <!-- Load bar — static 0% -->
    <div class="load-row">
      <span class="metric-label">LOAD</span>
      <div class="load-track">
        <div class="load-fill" style="width:0%"></div>
      </div>
      <span class="load-val dim">0%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRobot, jointConfigs, radToUi } from '../composables/useRobot.js'

// No setInterval, no Math.random() — all random/timer logic removed.

const { state } = useRobot()

const props = defineProps({
  name:        { type: String, required: true },
  /** Index into jointConfigs / state.angles (0=J1, 1=J2, 2=J3) */
  jointIndex:  { type: Number, required: true },
  accentColor: { type: String, default: '#38bdf8' },
})

const cfg        = jointConfigs[props.jointIndex]
const jointLabel = `J${props.jointIndex + 1}`

// Live angle from slider → global state (the only live data source)
const angleDisplay = computed(() =>
  parseFloat(radToUi(state.angles[props.jointIndex], cfg).toFixed(1))
)

const anglePct = computed(() => {
  const { uiMin, uiMax } = cfg
  return Math.max(0, Math.min(100,
    ((angleDisplay.value - uiMin) / (uiMax - uiMin)) * 100
  ))
})
</script>

<style scoped>
.axis-card {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.3s;
}
.axis-card:hover { border-color: rgba(255,255,255,0.1); }

/* ── Header ── */
.axis-header { display: flex; align-items: center; gap: 10px; }
.axis-icon {
  width: 30px; height: 30px;
  border-radius: 8px; border: 1px solid;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.axis-name { font-size: 13px; font-weight: 600; color: #e2e8f0; }
.axis-type { font-size: 10px; color: #475569; margin-top: 1px; letter-spacing: 0.04em; }

.status-pill {
  margin-left: auto;
  font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
  padding: 3px 8px; border-radius: 20px;
}
.status-pill.standby {
  color: #475569;
  background: rgba(71,85,105,0.12);
  border: 1px solid rgba(71,85,105,0.25);
}

/* ── Angle row ── */
.angle-row {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 8px; padding: 6px 10px;
}
.ar-label {
  font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
  color: #334155; min-width: 72px;
}
.angle-track {
  flex: 1; height: 4px; background: #1e293b;
  border-radius: 2px; overflow: hidden;
}
.angle-fill { height: 100%; border-radius: 2px; transition: width 0.35s ease; }
.ar-val {
  font-size: 14px; font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  min-width: 46px; text-align: right;
}
.ar-unit { font-size: 10px; color: #475569; margin-left: 1px; }

/* ── Metrics ── */
.metrics-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.metric-block { display: flex; flex-direction: column; gap: 3px; }
.metric-label {
  font-size: 9px; font-weight: 600;
  letter-spacing: 0.08em; color: #475569;
}
.metric-value {
  font-size: 16px; font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: #e2e8f0; line-height: 1;
}
.metric-value.dim { color: #334155; }
.unit { font-size: 10px; font-weight: 400; color: #334155; margin-left: 1px; }

.mini-bar-track {
  height: 3px; background: #1e293b;
  border-radius: 2px; overflow: hidden; margin-top: 2px;
}
.mini-bar-fill { height: 100%; border-radius: 2px; }

/* ── Load ── */
.load-row { display: flex; align-items: center; gap: 8px; }
.load-track {
  flex: 1; height: 5px; background: #1e293b;
  border-radius: 3px; overflow: hidden;
}
.load-fill { height: 100%; border-radius: 3px; }
.load-val {
  font-size: 11px; font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: #94a3b8; min-width: 32px; text-align: right;
}
.load-val.dim { color: #334155; }
</style>
