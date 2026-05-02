import {useNuxtApp} from '#app'

function authApiClient() {
    return useNuxtApp().$authApiClient
}

export const cartApi = {

    getCart() {
        return authApiClient()('/cart', {
            method: 'GET'
        })
    },

    addItem(payload: { id: number; qty: number }) {
        return authApiClient()('/cart/add', {
            method: 'POST',
            body: payload
        })
    },

    updateItem(payload: { id: number; qty: number }) {
        return authApiClient()('/cart/update', {
            method: 'POST',
            body: payload
        })
    },

    removeItem(id: number) {
        return authApiClient()('/cart/remove', {
            method: 'POST',
            body: {id}
        })
    },

    clear() {
        return authApiClient()('/cart/clear', {
            method: 'POST'
        })
    },

    checkout(payload: { comment?: string }) {
        return api()('/orders/checkout', {
            method: 'POST',
            body: payload
        })
    }

}
