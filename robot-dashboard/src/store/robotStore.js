import { defineStore } from 'pinia'

export const useRobotStore = defineStore('robot', {
  state: () => ({
    angles: [0, 0, 0, 0, 0],
    gripperOpen: false,
    anomalies: [],
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
    }
  }
})
