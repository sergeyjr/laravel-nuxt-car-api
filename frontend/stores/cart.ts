import {defineStore} from 'pinia'
import {useCartApi} from '~/services/api/cart.api'

function toPositiveInt(value: unknown, fallback = 1) {
    const n = Number(value)
    if (!Number.isFinite(n)) return fallback
    return Math.max(1, Math.floor(n))
}

function toNumber(value: unknown, fallback = 0) {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
}

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
            qty: toPositiveInt(item.qty, 1),
            price: toNumber(item.price, 0)
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
                    sum + toNumber(item.price, 0) * toPositiveInt(item.qty, 1),
                0
            )
    },

    actions: {

        reset() {
            this.items = {}
            this.initialized = false

            this.loading = false
            this.loadingFetch = false
            this.loadingAdd = false
            this.loadingUpdate = false
            this.loadingRemove = false
            this.loadingClear = false
            this.loadingCheckout = false
        },

        async fetch(force = false, silent = false) {

            if (this.initialized && !force) {
                return
            }

            const cartApi = useCartApi()

            if (!silent) {
                this.loading = true
            }

            this.loadingFetch = true

            try {
                const data: any = await cartApi.getCart()
                this.items = cleanItems(data?.items ?? data)
                this.initialized = true
            } catch (e) {
                console.error(e)
                this.items = {}
                this.initialized = false
            } finally {
                if (!silent) {
                    this.loading = false
                }
                this.loadingFetch = false
            }

        },

        async refresh() {
            await this.fetch(true, true)
        },

        async add(payload: any) {

            const cartApi = useCartApi()

            this.loadingAdd = true

            try {
                await cartApi.addItem({
                    id: Number(payload.id),
                    qty: toPositiveInt(payload.qty, 1)
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
                    qty: toPositiveInt(qty, 1)
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
                this.initialized = false

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
