export const useCartApi = () => {

    const api = useApi()

    const logResponse = async <T>(label: string, promise: Promise<T>) => {
        try {
            const res = await promise
            console.log(`[CartAPI] ${label} → response:`, res)
            return res
        } catch (err) {
            console.error(`[CartAPI] ${label} → error:`, err)
            throw err
        }
    }

    return {

        async getCart() {
            console.log('[CartAPI] getCart → request')
            return logResponse('getCart', api.get('/api/cart'))
        },

        async addItem(payload: { id: number; qty: number }) {
            console.log('[CartAPI] addItem → request', payload)
            return logResponse(
                'addItem',
                api.post('/api/cart/add', payload)
            )
        },

        async updateItem(payload: { id: number; qty: number }) {
            console.log('[CartAPI] updateItem → request', payload)
            return logResponse(
                'updateItem',
                api.post('/api/cart/update', payload)
            )
        },

        async removeItem(id: number) {
            console.log('[CartAPI] removeItem → request', { id })
            return logResponse(
                'removeItem',
                api.post('/api/cart/remove', { id })
            )
        },

        async clear() {
            console.log('[CartAPI] clear → request')
            return logResponse(
                'clear',
                api.post('/api/cart/clear')
            )
        },

        async checkout(payload: { comment?: string }) {
            console.log('[CartAPI] checkout → request', payload)
            return logResponse(
                'checkout',
                api.post('/api/orders/checkout', payload)
            )
        }

    }
}
