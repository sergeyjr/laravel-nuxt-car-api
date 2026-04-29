import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        orders: [] as any[],
        ordersCount: 0,
        carsCount: 0,

        cart: {} as Record<string, any>,
        cartTotal: 0,

        loading: false,
        loaded: false,
        error: null as any
    }),

    actions: {
        getApi() {
            return useNuxtApp().$api
        },

        async fetchDashboard(force = false) {
            if (this.loaded && !force) return

            const api = this.getApi()

            this.loading = true
            this.error = null

            try {
                const { data } = await api.get('/api/dashboard')

                this.carsCount = data?.carsCount ?? 0

                this.ordersCount = data?.ordersCount ?? 0
                this.orders = data?.orders ?? []

                this.cart = data?.cart ?? {}
                this.cartTotal = data?.cartTotal ?? 0

                this.loaded = true

            } catch (e: any) {
                this.error = e
                console.error('Dashboard error:', e)

            } finally {
                this.loading = false
            }
        }
    }
})
