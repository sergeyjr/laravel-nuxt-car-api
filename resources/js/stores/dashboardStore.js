import {defineStore} from 'pinia'
import {api} from '@/api'

export const useDashboardStore = defineStore('dashboard', {

    state: () => ({
        carsCount: null,
        loaded: false,
        loading: false,
        error: null
    }),

    actions: {
        async fetchDashboard() {
            if (this.loaded) return

            this.loading = true
            this.error = null

            try {
                const {data} = await api.get('/api/dashboard')
                this.carsCount = data?.carsCount ?? 0
                this.loaded = true
            } catch (e) {
                this.error = e
                console.error('Dashboard error:', e)
            } finally {
                this.loading = false
            }
        }
    }

})
