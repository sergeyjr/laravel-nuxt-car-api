import {defineStore} from 'pinia'
import {useOrderApi} from '~/services/api/internal/order.api'

export const useOrderStore = defineStore('order', {

    state: () => ({
        currentOrder: null as any,
        orders: [] as any[],
        loading: false,
        error: null as any,
        initialized: false,
        orderCache: {} as Record<string, any>
    }),

    actions: {

        async fetchOrder(id: string | number) {
            const key = String(id).trim()
            const orderId = Number(id)
            const orderApi = useOrderApi()

            if (!key || Number.isNaN(orderId)) {
                this.currentOrder = null
                return null
            }

            this.loading = true
            this.error = null

            try {
                if (this.orderCache[key]) {
                    this.currentOrder = this.orderCache[key]
                    return this.currentOrder
                }

                const data = await orderApi.getOrder(orderId)

                if (!data) {
                    this.currentOrder = null
                    return null
                }

                this.currentOrder = data
                this.orderCache[key] = data

                return data
            } catch (e) {
                this.error = e
                this.currentOrder = null
                console.error('Order fetch error:', e)
                return null
            } finally {
                this.loading = false
            }
        },

        async fetchOrders() {
            const orderApi = useOrderApi()

            this.loading = true
            this.error = null

            try {
                const data = await orderApi.getOrders()
                this.orders = Array.isArray(data) ? data : (data ?? [])
                return this.orders
            } catch (e) {
                this.error = e
                console.error('Orders fetch error:', e)
                return []
            } finally {
                this.loading = false
                this.initialized = true
            }
        }

    }

})
