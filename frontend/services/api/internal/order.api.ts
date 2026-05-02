import {useNuxtApp} from '#app'

export interface Order {
    id: number
    created_at: string
    status: string
    total: number
    items?: any[]
}

function authApiClient() {
    return useNuxtApp().$authApiClient
}

export const orderApi = {

    getOrder(id: number | string): Promise<Order> {
        return authApiClient()(`/orders/${id}`)
    },

    getOrders(): Promise<Order[]> {
        return authApiClient()('/orders')
    }

}
