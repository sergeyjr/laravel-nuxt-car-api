import {useNuxtApp} from '#app'

function api() {
    return useNuxtApp().$api
}

export const cartApi = {

    getCart() {
        return api()('/cart', {
            method: 'GET'
        })
    },

    addItem(payload: { id: number; qty: number }) {
        return api()('/cart/add', {
            method: 'POST',
            body: payload
        })
    },

    updateItem(payload: { id: number; qty: number }) {
        return api()('/cart/update', {
            method: 'POST',
            body: payload
        })
    },

    removeItem(id: number) {
        return api()('/cart/remove', {
            method: 'POST',
            body: {id}
        })
    },

    clear() {
        return api()('/cart/clear', {
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
