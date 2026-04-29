import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
    state: () => ({
        alerts: [] as {
            id: number
            type: string
            message: string
            timeout?: ReturnType<typeof setTimeout>
        }[]
    }),

    actions: {
        add(type: string, message: string) {
            const id = Date.now()

            const timeout = setTimeout(() => {
                this.remove(id)
            }, 60000)

            this.alerts.push({ id, type, message, timeout })
        },

        remove(id: number) {
            const alert = this.alerts.find(a => a.id === id)

            if (alert?.timeout) {
                clearTimeout(alert.timeout)
            }

            this.alerts = this.alerts.filter(a => a.id !== id)
        },

        clear() {
            this.alerts = []
        }
    }
})
