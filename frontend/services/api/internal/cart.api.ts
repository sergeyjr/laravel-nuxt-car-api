import {useApi} from '~/composables/useApi'

export const useCartApi = () => {

    const {authApi} = useApi()

    return {

        getCart() {
            return authApi('/cart')
        },

        addItem(payload: { id: number; qty: number }) {
            return authApi('/cart/add', {
                method: 'POST',
                body: payload
            })
        },

        updateItem(payload: { id: number; qty: number }) {
            return authApi('/cart/update', {
                method: 'POST',
                body: payload
            })
        },

        removeItem(id: number) {
            return authApi('/cart/remove', {
                method: 'POST',
                body: {id}
            })
        },

        clear() {
            return authApi('/cart/clear', {
                method: 'POST'
            })
        },

        checkout(payload: { comment?: string }) {
            return authApi('/orders/checkout', {
                method: 'POST',
                body: payload
            })
        }

    }

}
