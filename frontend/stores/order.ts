import { defineStore } from 'pinia'
import { orderApi } from '~/services/api/internal/order.api'

export const useOrderStore = defineStore('order', {
    state: () => ({
        currentOrder: null as any,
        orders: [] as any[],

        loading: false,
        error: null as any,

        initialized: false,

        orderCache: new Map<string, any>()
    }),

    actions: {

        async fetchOrder(id: number | string) {
            if (!id) return

            const key = String(id)

            this.loading = true
            this.error = null

            // важно: сбрасываем старое значение
            this.currentOrder = null

            try {
                if (this.orderCache.has(key)) {
                    this.currentOrder = this.orderCache.get(key)
                    return
                }

                const data = await orderApi.getOrder(id)

                this.currentOrder = data

                this.orderCache.set(key, data)

            } catch (e) {
                this.error = e
                console.error('Order fetch error:', e)

            } finally {
                this.loading = false
            }
        },

        async fetchOrders() {
            this.loading = true
            this.error = null

            try {
                const data = await orderApi.getOrders()

                this.orders = Array.isArray(data) ? data : (data ?? [])

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
