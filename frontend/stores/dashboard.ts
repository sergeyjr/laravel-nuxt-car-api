import {defineStore} from 'pinia'
import type {User} from '~/types/auth'
import {useDashboardApi} from "~/services/api/internal/dashboard.api";

export const useDashboardStore = defineStore('dashboard', {

    state: () => ({
        orders: [] as any[],
        ordersCount: 0,

        carsCount: 0,
        myCarsCount: 0,

        cart: {} as Record<string, any>,
        cartTotal: 0,

        loading: false,
        loaded: false,
        error: null as any,
    }),

    actions: {

        async fetchDashboard(force = false) {

            const dashboardApi = useDashboardApi()

            if (this.loaded && !force) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const data: any = await dashboardApi.getDashboard()
                this.carsCount = data.carsCount ?? 0
                this.myCarsCount = data.myCarsCount ?? 0
                this.ordersCount = data.ordersCount ?? 0
                this.orders = data.orders ?? []
                this.cart = data.cart ?? {}
                this.cartTotal = data.cartTotal ?? 0
                this.loaded = true
            } catch (e: any) {
                console.log('[dashboard] ERROR', e)
                this.error = e
            } finally {
                this.loading = false
            }

        }

    }

})
