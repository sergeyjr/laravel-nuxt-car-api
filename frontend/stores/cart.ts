import {defineStore} from 'pinia'
import {useCartApi} from '~/services/api/internal/cart.api'

function cleanItems(payload: any) {
    if (!payload) return {}

    const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.items)
            ? payload.items
            : Array.isArray(payload.data?.items)
                ? payload.data.items
                : []

    return items.reduce((acc: any, item: any) => {

        if (!item?.id) {
            return acc
        }

        acc[String(item.id)] = {
            ...item,
            id: Number(item.id),
            qty: Number(item.qty ?? 1),
            price: Number(item.price ?? 0)
        }

        return acc

    }, {})
}

export const useCartStore = defineStore('cart', {

    state: () => ({
        items: {} as Record<string, any>,

        initialized: false,
        loading: false,

        loadingFetch: false,
        loadingAdd: false,
        loadingUpdate: false,
        loadingRemove: false,
        loadingClear: false,
        loadingCheckout: false
    }),

    getters: {

        total: state =>
            Object.values(state.items).reduce(
                (sum: number, item: any) =>
                    sum + Number(item.price) * Number(item.qty),
                0
            )

    },

    actions: {

        reset() {
            this.items = {}
            this.initialized = false
        },

        async fetch(force = false) {

            if (this.initialized && !force) {
                return
            }

            const cartApi = useCartApi()

            this.loading = true
            this.loadingFetch = true

            try {
                const data: any = await cartApi.getCart()
                this.items = cleanItems(data?.items ?? data)
            } catch (e) {
                console.error(e)
                this.items = {}
            } finally {
                this.loading = false
                this.loadingFetch = false
                this.initialized = true
            }

        },

        async refresh() {
            await this.fetch(true)
        },

        async add(payload: any) {

            const cartApi = useCartApi()

            this.loadingAdd = true

            try {
                await cartApi.addItem({
                    id: Number(payload.id),
                    qty: Number(payload.qty ?? 1)
                })
                await this.refresh()
            } catch (e) {
                console.error(e)
            } finally {
                this.loadingAdd = false
            }

        },

        async update(id: number | string, qty: number) {

            const cartApi = useCartApi()

            this.loadingUpdate = true

            try {
                await cartApi.updateItem({
                    id: Number(id),
                    qty: Math.max(1, Number(qty))
                })
                await this.refresh()
            } catch (e) {
                console.error(e)
            } finally {
                this.loadingUpdate = false
            }

        },

        async remove(id: number | string) {

            const cartApi = useCartApi()

            this.loadingRemove = true

            try {
                await cartApi.removeItem(Number(id))
                await this.refresh()
            } catch (e) {
                console.error(e)
            } finally {
                this.loadingRemove = false
            }

        },

        async clear() {

            const cartApi = useCartApi()

            this.loadingClear = true

            try {
                await cartApi.clear()
                this.items = {}
            } catch (e) {
                console.error(e)
            } finally {
                this.loadingClear = false
            }

        },

        async checkout(payload: any = {}) {

            const cartApi = useCartApi()

            this.loadingCheckout = true

            try {
                const data = await cartApi.checkout({
                    comment: payload.comment || null
                })
                this.items = {}
                return data
            } catch (e) {
                console.error(e)
                throw e
            } finally {
                this.loadingCheckout = false
            }

        }

    }

})
