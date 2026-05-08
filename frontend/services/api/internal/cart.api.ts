export const useCartApi = () => {

    const api = useApi()

    return {

        async getCart() {
            return api.get('/cart')
        },

        addItem(payload: { id: number; qty: number }) {
            return api.post('/cart/add', {
                body: payload
            })
        },

        updateItem(payload: { id: number; qty: number }) {
            return api.post('/cart/update', {
                body: payload
            })
        },

        removeItem(id: number) {
            return api.post('/cart/remove', {
                body: {id}
            })
        },

        clear() {
            return api.post('/cart/clear')
        },

        checkout(payload: { comment?: string }) {
            return api.post('/orders/checkout', {
                body: payload
            })
        }

    }

}
