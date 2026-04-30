import {defineStore} from 'pinia'
import {orderApi} from '~/services/api/order.api'

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

        api() {
            return orderApi(this.getApi())
        },

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

                const data = await this.api().getOrder(id)

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
            this.loading = true
            this.error = null

            try {
                this.orders = await this.api().getOrders()

            } catch (e: any) {
                this.error = e
                console.error('Orders fetch error:', e)

            } finally {
                this.loading = false
            }
        }
    }
})
