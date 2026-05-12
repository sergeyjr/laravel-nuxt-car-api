import type {OrderResponse} from '~/types/order'

export const useOrderApi = () => {

    const api = useApi()

    return {

        async getOrder(id: number) {
            console.log('[OrderAPI] getOrder → request', id)
            const res = await api.get<OrderResponse>(`/api/orders/${id}`)
            console.log('[OrderAPI] getOrder → response', res)
            return res
        },

        async getOrders() {
            console.log('[OrderAPI] getOrders → request')
            const res = await api.get<OrderResponse[]>('/api/orders')
            console.log('[OrderAPI] getOrders → response', res)
            return res
        }

    }

}
