import type {OrderResponse} from '~/types/order'

export const useOrderApi = () => {

    const api = useApi()

    return {

        getOrder(id: number) {
            return api.get<OrderResponse>(`/api/orders/${id}`)
        },

        getOrders() {
            return api.get<OrderResponse[]>('/api/orders')
        }

    }

}
