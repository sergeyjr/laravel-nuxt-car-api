import {useApi} from '~/composables/useApi'

export interface Order {
    id: number
    created_at: string
    status: string
    total: number
    items?: any[]
}

export const useOrderApi = () => {

    const {authApi} = useApi()

    return {

        getOrder(id: number | string): Promise<Order> {
            return authApi(`/orders/${id}`)
        },

        getOrders(): Promise<Order[]> {
            return authApi('/orders')
        }

    }

}
