import {useApi} from '~/composables/useApi'

export const useCartApi = () => {

    const {apiToken} = useApi()

    return {

        async getCart() {
            return apiToken('/cart')
        },

        addItem(payload: { id: number; qty: number }) {
            return apiToken('/cart/add', {
                method: 'POST',
                body: payload
            })
        },

        updateItem(payload: { id: number; qty: number }) {
            return apiToken('/cart/update', {
                method: 'POST',
                body: payload
            })
        },

        removeItem(id: number) {
            return apiToken('/cart/remove', {
                method: 'POST',
                body: {id}
            })
        },

        clear() {
            return apiToken('/cart/clear', {
                method: 'POST'
            })
        },

        checkout(payload: { comment?: string }) {
            return apiToken('/orders/checkout', {
                method: 'POST',
                body: payload
            })
        }

    }

}
