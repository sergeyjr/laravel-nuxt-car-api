import {defineStore} from 'pinia'
import {useOrderApi} from '~/services/api/internal/order.api'

export const useOrderStore = defineStore('order', {

    state: () => ({
        currentOrder: null as any,
        orders: [] as any[],
        loading: false,
        loadingOrder: false,
        loadingOrders: false,
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

            this.loadingOrder = true
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
                this.loadingOrder = false
            }
        },

        async fetchOrders(force = false) {
            const orderApi = useOrderApi()

            if (this.initialized && !force) {
                return this.orders
            }

            this.loading = true
            this.loadingOrders = true
            this.error = null

            try {
                const data = await orderApi.getOrders()

                this.orders = Array.isArray(data)
                    ? data
                    : (data ?? [])

                this.initialized = true
                return this.orders

            } catch (e) {
                this.error = e
                console.error('Orders fetch error:', e)
                return []

            } finally {
                this.loading = false
                this.loadingOrders = false
            }
        }

    }

})
