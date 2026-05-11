export const useCartApi = () => {

    const api = useApi()

    return {

        async getCart() {
            console.log('[CartAPI] getCart → request')
            const res = await api.get('/api/cart')
            console.log('[CartAPI] getCart → response', res)
            return res
        },

        async addItem(payload: { id: number; qty: number }) {
            console.log('[CartAPI] addItem → request', payload)
            const res = await api.post('/api/cart/add', payload)
            console.log('[CartAPI] addItem → response', res)
            return res
        },

        async updateItem(payload: { id: number; qty: number }) {
            console.log('[CartAPI] updateItem → request', payload)
            const res = await api.post('/api/cart/update', payload)
            console.log('[CartAPI] updateItem → response', res)
            return res
        },

        async removeItem(id: number) {
            console.log('[CartAPI] removeItem → request', {id})
            const res = await api.post('/api/cart/remove', {id})
            console.log('[CartAPI] removeItem → response', res)
            return res
        },

        async clear() {
            console.log('[CartAPI] clear → request')
            const res = await api.post('/api/cart/clear')
            console.log('[CartAPI] clear → response', res)
            return res
        },

        async checkout(payload: { comment?: string }) {
            console.log('[CartAPI] checkout → request', payload)
            const res = await api.post('/api/orders/checkout', payload)
            console.log('[CartAPI] checkout → response', res)
            return res
        }

    }

}
