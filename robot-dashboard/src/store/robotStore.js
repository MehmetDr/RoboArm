import { defineStore } from 'pinia'

export const useRobotStore = defineStore('robot', {
  state: () => ({
    angles: [0, 0, 0, 0, 0],
    gripperOpen: false,
    anomalies: [],
    aiLogs: [],
  }),
  actions: {
    setAngle(index, radValue) {
      this.angles.splice(index, 1, radValue)
    },
    toggleGripper(open) {
      this.gripperOpen = open
      this.angles.splice(4, 1, open ? 0 : -0.8)
    },
    addAnomaly(payload) {
      this.anomalies.unshift(payload)
    },
    homePosition() {
      for (let i = 0; i < this.angles.length; i++) {
        this.angles.splice(i, 1, 0)
      }
    },
    addAiLog(msg) {
      this.aiLogs.unshift({
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        message: msg
      })
    },
    async executeTask(taskName, targetAngles) {
      this.addAiLog(`GÖREV BAŞLATILDI: ${taskName}`)
      this.addAiLog("Hedef hesaplanıyor...")
      await new Promise(r => setTimeout(r, 600))
      this.addAiLog("Optimum yörünge çiziliyor...")
      await new Promise(r => setTimeout(r, 600))
      
      const startAngles = [...this.angles]
      const duration = 1500 // 1.5 seconds interpolation
      const steps = 45
      const stepTime = duration / steps
      let currentStep = 0

      this.addAiLog("Hareket dizisi (trajectory) uygulanıyor...")

      const interval = setInterval(() => {
        currentStep++
        const t = currentStep / steps
        for (let i = 0; i < 4; i++) { 
          if (targetAngles[i] !== undefined) {
            const newVal = startAngles[i] + (targetAngles[i] - startAngles[i]) * t
            this.angles.splice(i, 1, newVal)
          }
        }

        if (currentStep >= steps) {
          clearInterval(interval)
          this.addAiLog("GÖREV TAMAMLANDI")
        }
      }, stepTime)
    }
  }
})
