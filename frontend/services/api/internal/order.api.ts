import type {OrderResponse} from '~/types/order'

export const useOrderApi = () => {

    const api = useApi()

    return {

        getOrder(id: number) {
            console.log('[OrderAPI] getOrder → request')
            return api.get<OrderResponse>(`/api/orders/${id}`)
        },

        getOrders() {
            console.log('[OrderAPI] getOrders → request')
            return api.get<OrderResponse[]>('/api/orders')
        }

    }

}
