import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
    state: () => ({
        currentOrder: null as any,
        orders: [] as any[],

        loading: false,
        error: null as any,

        orderCache: new Map<number | string, any>()
    }),

    actions: {
        getApi() {
            return useNuxtApp().$api
        },

        // --- SINGLE ORDER ---
        async fetchOrder(id: number | string) {
            if (!id) return

            // cache
            if (this.orderCache.has(id)) {
                this.currentOrder = this.orderCache.get(id)
                return
            }

            const api = this.getApi()

            this.loading = true
            this.error = null

            try {
                const { data } = await api.get(`/api/orders/${id}`)

                this.currentOrder = data
                this.orderCache.set(id, data)

            } catch (e: any) {
                this.error = e
                console.error('Order fetch error:', e)

            } finally {
                this.loading = false
            }
        },

        // --- LIST ---
        async fetchOrders() {
            const api = this.getApi()

            this.loading = true
            this.error = null

            try {
                const { data } = await api.get('/api/orders')

                this.orders = data

            } catch (e: any) {
                this.error = e
                console.error('Orders fetch error:', e)

            } finally {
                this.loading = false
            }
        }
    }
})
