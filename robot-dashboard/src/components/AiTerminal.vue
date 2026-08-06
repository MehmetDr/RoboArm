<template>
  <div class="ai-terminal">
    <div class="terminal-header">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2">
        <path d="M4 17l6-6-6-6M12 19h8"></path>
      </svg>
      <span style="color:#a855f7">AI TERMINAL</span>
    </div>
    <div class="terminal-body">
      <div v-for="log in state.aiLogs" :key="log.id" class="terminal-line">
        <span class="term-time">[{{ formatTime(log.timestamp) }}]</span>
        <span class="term-msg">{{ log.message }}</span>
      </div>
      <div v-if="state.aiLogs.length === 0" class="terminal-line empty">
        Sistem hazır. Otonom görev komutu bekleniyor...
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRobot } from '../composables/useRobot.js'

const { state } = useRobot()

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + String(d.getMilliseconds()).padStart(3, '0')
}
</script>

<style scoped>
.ai-terminal {
  background: #0a0d14;
  border: 1px solid rgba(168,85,247,0.2);
  border-radius: 12px;
  padding: 10px 12px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.terminal-header {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
}
.terminal-body {
  max-height: 120px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
}
.terminal-line {
  display: flex;
  gap: 8px;
  padding: 3px 0;
  border-bottom: 1px solid rgba(255,255,255,0.02);
}
.terminal-line:last-child {
  border-bottom: none;
}
.term-time { color: #64748b; flex-shrink: 0; }
.term-msg { color: #d8b4fe; }
.terminal-line.empty { color: #475569; justify-content: center; font-style: italic; }
</style>
