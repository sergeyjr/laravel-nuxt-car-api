import {useNuxtApp} from '#app'

function api() {
    return useNuxtApp().$api
}

export const cartApi = {
    getCart() {
        return api()('/cart')
    },

    addItem(payload: { id: number; qty: number }) {
        return api()('/sanctum/csrf-cookie').then(() =>
            api()('/cart/add', {
                method: 'POST',
                body: payload
            })
        )
    },

    updateItem(payload: { id: number; qty: number }) {
        return api()('/sanctum/csrf-cookie').then(() =>
            api()('/cart/update', {
                method: 'POST',
                body: payload
            })
        )
    },

    removeItem(id: number) {
        return api()('/sanctum/csrf-cookie').then(() =>
            api()('/cart/remove', {
                method: 'POST',
                body: {id}
            })
        )
    },

    clear() {
        return api()('/sanctum/csrf-cookie').then(() =>
            api()('/cart/clear', {
                method: 'POST'
            })
        )
    },

    checkout(payload: { comment?: string }) {
        return api()('/sanctum/csrf-cookie').then(() =>
            api()('/orders/checkout', {
                method: 'POST',
                body: payload
            })
        )
    }
}
