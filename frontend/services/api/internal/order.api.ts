import {useApi} from '~/composables/useApi'

export interface Order {
    id: number
    created_at: string
    status: string
    total: number
    items?: any[]
}

export const useOrderApi = () => {

    const {apiToken} = useApi()

    return {

        getOrder(id: number | string): Promise<Order> {
            return apiToken(`/orders/${id}`)
        },

        getOrders(): Promise<Order[]> {
            return apiToken('/orders')
        }

    }

}
