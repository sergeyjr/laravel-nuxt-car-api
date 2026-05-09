export const useCartApi = () => {

    const api = useApi()

    return {

        async getCart() {
            return api.get('/api/cart')
        },

        addItem(payload: { id: number; qty: number }) {
            return api.post('/api/cart/add', {
                body: payload
            })
        },

        updateItem(payload: { id: number; qty: number }) {
            return api.post('/api/cart/update', {
                body: payload
            })
        },

        removeItem(id: number) {
            return api.post('/api/cart/remove', {
                body: {id}
            })
        },

        clear() {
            return api.post('/api/cart/clear')
        },

        checkout(payload: { comment?: string }) {
            return api.post('/api/orders/checkout', {
                body: payload
            })
        }

    }

}
