export const useCartApi = () => {

    const api = useApi()

    return {

        getCart() {
            console.log('[CartAPI] getCart → request')
            return api.get('/api/cart')
        },

        addItem(payload: { id: number; qty: number }) {
            console.log('[CartAPI] addItem → request')
            return api.post('/api/cart/add', payload)
        },

        updateItem(payload: { id: number; qty: number }) {
            console.log('[CartAPI] updateItem → request')
            return api.post('/api/cart/update', payload)
        },

        removeItem(id: number) {
            console.log('[CartAPI] removeItem → request')
            return api.post('/api/cart/remove', {id})
        },

        clear() {
            console.log('[CartAPI] clear → request')
            return api.post('/api/cart/clear')
        },

        checkout(payload: { comment?: string }) {
            console.log('[CartAPI] checkout → request')
            return api.post('/api/orders/checkout', payload)
        }

    }

}
