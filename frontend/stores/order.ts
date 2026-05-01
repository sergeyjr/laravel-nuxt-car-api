import {defineStore} from 'pinia'
import {orderApi} from '~/services/api/order.api'

export const useOrderStore = defineStore('order', {
    state: () => ({
        currentOrder: null as any,
        orders: [] as any[],

        loading: false,
        error: null as any,

        initialized: false,

        orderCache: new Map<number | string, any>()
    }),

    actions: {

        // --- SINGLE ORDER ---
        async fetchOrder(id: number | string) {
            if (!id) return

            this.loading = true
            this.error = null

            try {
                if (this.orderCache.has(id)) {
                    this.currentOrder = this.orderCache.get(id)
                    return
                }

                const data = await orderApi.getOrder(id)

                this.currentOrder = data
                this.orderCache.set(id, data)

            } catch (e) {
                this.error = e
                console.error('Order fetch error:', e)

            } finally {
                this.loading = false
            }
        },

        // --- LIST ---
        async fetchOrders() {
            this.loading = true
            this.error = null

            try {
                const data = await orderApi.getOrders()

                this.orders = (data ?? []) as any[]

            } catch (e) {
                this.error = e
                console.error('Orders fetch error:', e)

            } finally {
                this.loading = false
                this.initialized = true
            }
        }

    }
})
