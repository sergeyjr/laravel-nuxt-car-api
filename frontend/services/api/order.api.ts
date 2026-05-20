import type {OrderResponse} from '~/types/order'

export const useOrderApi = () => {

    const api = useApi()

    return {

        getOrder(id: number) {
            debugLog('[OrderAPI] getOrder → request')
            return api.get<OrderResponse>(`/api/orders/${id}`)
        },

        getOrders() {
            debugLog('[OrderAPI] getOrders → request')
            return api.get<OrderResponse[]>('/api/orders')
        }

    }

}
