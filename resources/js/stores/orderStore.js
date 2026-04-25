import {defineStore} from "pinia"
import {api} from "@/api"

export const useOrderStore = defineStore("order", {
    state: () => ({
        currentOrder: null,
        orders: []
    }),

    actions: {

        async fetchOrder(id) {
            const res = await api.get(`/api/orders/${id}`)
            this.currentOrder = res.data
        },

        async fetchOrders() {
            const res = await api.get('/api/orders')
            this.orders = res.data
        }

    }
})
