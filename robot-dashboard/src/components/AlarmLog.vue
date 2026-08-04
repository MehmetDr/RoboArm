<template>
  <div class="alarm-log">
    <!-- Header -->
    <div class="alarm-header">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#eab308" stroke-width="1.5"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#eab308" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>AI ANOMALY LOG</span>

      <!-- Aktif anomali sayısı rozeti -->
      <span class="alarm-count" :class="{ 'alarm-count--critical': hasCritical }">
        {{ state.anomalies.length }}
      </span>

      <!-- Temizle butonu (anomali varsa göster) -->
      <button
        v-if="state.anomalies.length > 0"
        class="clear-btn"
        @click="clearAll"
        title="Tüm anomalileri temizle"
      >
        CLEAR
      </button>
    </div>

    <!-- Liste -->
    <div class="alarm-list" ref="listEl">
      <!-- Boş durum -->
      <div v-if="state.anomalies.length === 0" class="alarm-empty">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="opacity:0.3">
          <path d="M9 12l2 2 4-4" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="10" stroke="#22c55e" stroke-width="1.5"/>
        </svg>
        <span>No anomalies detected</span>
      </div>

      <!-- Anomali satırları (en yeni üstte) -->
      <transition-group name="log-slide" tag="div" class="alarm-rows">
        <div
          v-for="anomaly in state.anomalies"
          :key="anomaly.id"
          class="alarm-item"
          :class="anomaly.severity === 'CRITICAL' ? 'alarm-item--critical' : 'alarm-item--warning'"
        >
          <!-- Sol renk şeridi + dot -->
          <div class="alarm-dot" :class="anomaly.severity === 'CRITICAL' ? 'dot--critical' : 'dot--warning'"></div>

          <!-- İkon -->
          <span class="alarm-icon">
            {{ anomaly.severity === 'CRITICAL' ? '✕' : '⚠' }}
          </span>

          <!-- İçerik -->
          <div class="alarm-body">
            <div class="alarm-top-row">
              <span class="alarm-severity" :class="anomaly.severity === 'CRITICAL' ? 'sev--critical' : 'sev--warning'">
                {{ anomaly.severity }}
              </span>
              <span class="alarm-axis">{{ anomaly.axis }}</span>
              <span class="alarm-type">{{ anomaly.type }}</span>
            </div>
            <div class="alarm-message">{{ anomaly.message }}</div>
          </div>

          <!-- Zaman damgası -->
          <span class="alarm-time">{{ formatTime(anomaly.timestamp) }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRobot } from '../composables/useRobot.js'

const { state } = useRobot()

const listEl = ref(null)

/** En az bir CRITICAL anomali var mı? (rozet rengi için) */
const hasCritical = computed(() =>
  state.anomalies.some(a => a.severity === 'CRITICAL')
)

/** ISO timestamp veya Date → HH:MM:SS */
function formatTime(ts) {
  if (!ts) return '--:--:--'
  const d = ts instanceof Date ? ts : new Date(ts)
  return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

/** Tüm anomalileri temizle */
function clearAll() {
  state.anomalies.splice(0)
}
</script>

<style scoped>
/* ── Wrapper ── */
.alarm-log {
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px 12px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ── Header ── */
.alarm-header {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #475569;
}

.alarm-count {
  font-size: 9px;
  font-weight: 700;
  color: #eab308;
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.25);
  padding: 1px 7px;
  border-radius: 10px;
  transition: all 0.3s;
}

/* CRITICAL varsa sayı rozeti kırmızıya döner */
.alarm-count--critical {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.12);
  border-color: rgba(220, 38, 38, 0.35);
  animation: countPulse 0.8s ease-in-out infinite;
}

@keyframes countPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

/* Temizle butonu */
.clear-btn {
  margin-left: auto;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #475569;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  padding: 2px 7px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}
.clear-btn:hover {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.08);
}

/* ── Liste ── */
.alarm-list {
  display: flex;
  flex-direction: column;
  max-height: 180px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #1e293b transparent;
}

.alarm-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Boş durum */
.alarm-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 14px 0;
  font-size: 10px;
  color: #334155;
  letter-spacing: 0.04em;
}

/* ── Anomali satırı ── */
.alarm-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 7px;
  position: relative;
  transition: background 0.2s;
}

.alarm-item--warning {
  background: rgba(249, 115, 22, 0.05);
  border: 1px solid rgba(249, 115, 22, 0.12);
}
.alarm-item--warning:hover { background: rgba(249, 115, 22, 0.09); }

.alarm-item--critical {
  background: rgba(220, 38, 38, 0.07);
  border: 1px solid rgba(220, 38, 38, 0.18);
}
.alarm-item--critical:hover { background: rgba(220, 38, 38, 0.12); }

/* Dot */
.alarm-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot--warning  { background: #f97316; box-shadow: 0 0 5px rgba(249, 115, 22, 0.7); }
.dot--critical {
  background: #dc2626;
  box-shadow: 0 0 6px rgba(220, 38, 38, 0.8);
  animation: dotBlink 0.8s ease-in-out infinite;
}
@keyframes dotBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* İkon */
.alarm-icon {
  font-size: 11px;
  line-height: 1;
  flex-shrink: 0;
}
.alarm-item--warning  .alarm-icon { color: #f97316; }
.alarm-item--critical .alarm-icon { color: #dc2626; }

/* İçerik */
.alarm-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.alarm-top-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.alarm-severity {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 1px 5px;
  border-radius: 4px;
}
.sev--warning  { color: #f97316; background: rgba(249, 115, 22, 0.12); }
.sev--critical { color: #dc2626; background: rgba(220, 38, 38, 0.12); }

.alarm-axis {
  font-size: 9px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 0px 4px;
  border-radius: 3px;
}

.alarm-type {
  font-size: 10px;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alarm-message {
  font-size: 9px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Zaman */
.alarm-time {
  font-size: 9px;
  font-family: 'JetBrains Mono', monospace;
  color: #334155;
  flex-shrink: 0;
  margin-left: auto;
}

/* ── transition-group animasyonu ── */
.log-slide-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.log-slide-leave-active {
  transition: all 0.2s ease;
}
.log-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.92);
}
.log-slide-leave-to {
  opacity: 0;
  transform: scaleY(0.8);
}
</style>
