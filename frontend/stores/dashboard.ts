import {defineStore} from 'pinia'
import {useDashboardApi} from '~/services/api/internal/dashboard.api'

export const useDashboardStore = defineStore('dashboard', {

    state: () => ({
        orders: [] as any[],
        ordersCount: 0,
        carsCount: 0,

        cart: {} as Record<string, any>,
        cartTotal: 0,

        loading: false,
        loaded: false,
        error: null as any,

        _promise: null as Promise<void> | null
    }),

    actions: {

        async fetchDashboard(force = false) {
            const dashboardApi = useDashboardApi()

            if (this._promise && !force) return this._promise
            if (this.loaded && !force) return

            this.loading = true
            this.error = null

            this._promise = (async () => {
                try {
                    const data = await dashboardApi.getDashboard()

                    this.carsCount = data.carsCount ?? 0
                    this.ordersCount = data.ordersCount ?? 0
                    this.orders = data.orders ?? []

                    this.cart = data.cart ?? {}
                    this.cartTotal = data.cartTotal ?? 0

                    this.loaded = true

                } catch (e: any) {
                    this.error = e
                    console.error('Dashboard error:', e)

                } finally {
                    this.loading = false
                    this._promise = null
                }
            })()

            return this._promise
        }

    }

})
