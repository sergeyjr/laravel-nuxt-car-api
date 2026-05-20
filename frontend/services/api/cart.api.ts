export const useCartApi = () => {

    const api = useApi()

    const logResponse = async <T>(label: string, promise: Promise<T>) => {
        try {
            const res = await promise
            debugLog(`[CartAPI] ${label} → response:`, res)
            return res
        } catch (err) {
            console.error(`[CartAPI] ${label} → error:`, err)
            throw err
        }
    }

    return {

        async getCart() {
            debugLog('[CartAPI] getCart → request')
            return logResponse('getCart', api.get('/api/cart'))
        },

        async addItem(payload: { id: number; qty: number }) {
            debugLog('[CartAPI] addItem → request', payload)
            return logResponse(
                'addItem',
                api.post('/api/cart/add', payload)
            )
        },

        async updateItem(payload: { id: number; qty: number }) {
            debugLog('[CartAPI] updateItem → request', payload)
            return logResponse(
                'updateItem',
                api.post('/api/cart/update', payload)
            )
        },

        async removeItem(id: number) {
            debugLog('[CartAPI] removeItem → request', { id })
            return logResponse(
                'removeItem',
                api.post('/api/cart/remove', { id })
            )
        },

        async clear() {
            debugLog('[CartAPI] clear → request')
            return logResponse(
                'clear',
                api.post('/api/cart/clear')
            )
        },

        async checkout(payload: { comment?: string }) {
            debugLog('[CartAPI] checkout → request', payload)
            return logResponse(
                'checkout',
                api.post('/api/orders/checkout', payload)
            )
        }

    }
}
