import {useApi} from '~/composables/useApi'

export interface Order {
    id: number
    created_at: string
    status: string
    total: number
    items?: any[]
}

export const useOrderApi = () => {

    const {api} = useApi()

    return {

        getOrder(id: number | string): Promise<Order> {
            return api(`/orders/${id}`)
        },

        getOrders(): Promise<Order[]> {
            return api('/orders')
        }

    }

}
