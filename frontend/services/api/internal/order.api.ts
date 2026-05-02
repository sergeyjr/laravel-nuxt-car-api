import {useNuxtApp} from '#app'

export interface Order {
    id: number
    created_at: string
    status: string
    total: number
    items?: any[]
}

function api() {
    return useNuxtApp().$api
}

export const orderApi = {

    getOrder(id: number | string): Promise<Order> {
        return api()(`/orders/${id}`)
    },

    getOrders(): Promise<Order[]> {
        return api()('/orders')
    }

}
