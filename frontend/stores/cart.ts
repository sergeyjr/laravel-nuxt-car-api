import {defineStore} from 'pinia'
import {toRaw} from 'vue'
import {useCartApi} from '~/services/api/internal/cart.api'

function cleanItems(items: any) {
    if (!items) {
        return {}
    }
    if (Array.isArray(items)) {
        return items.reduce((acc: any, item: any) => {
            if (!item?.id) {
                return acc
            }
            acc[String(item.id)] = item
            return acc
        }, {})
    }
    return Object.fromEntries(
        Object.entries(items).filter(([_, item]) => item != null)
    )
}

export const useCartStore = defineStore('cart', {

    state: () => ({
        items: {} as Record<string, any>,
        initialized: false,
        hydrated: false,

        // общий
        loading: false,

        // отдельные состояния
        loadingFetch: false,
        loadingAdd: false,
        loadingUpdate: false,
        loadingRemove: false,
        loadingClear: false,
        loadingCheckout: false,

        updateQueue: {} as Record<string, number>,
        syncVersion: {} as Record<string, number>,
        updating: {} as Record<string, boolean>,
    }),

    getters: {

        total: (state) =>
            Object.values(state.items).reduce((sum: number, item: any) => {
                if (!item) return sum

                return sum + Number(item.price) * Number(item.qty)
            }, 0)

    },

    actions: {

        hydrate() {
            if (!import.meta.client || this.hydrated) return

            this.hydrated = true

            const raw = localStorage.getItem('cartItems')
            if (!raw) return

            let localItems: Record<string, any> = {}

            try {
                localItems = cleanItems(JSON.parse(raw))
            } catch (e) {
                console.error('Ошибка чтения cartItems из localStorage:', e)
                return
            }

            const hasServerItems = Object.keys(this.items).length > 0
            const hasLocalItems = Object.keys(localItems).length > 0

            if (!hasServerItems && hasLocalItems) {
                this.items = localItems
            }

            this.initialized = true
        },

        save() {
            if (!import.meta.client) return

            localStorage.setItem(
                'cartItems',
                JSON.stringify(toRaw(this.items))
            )
        },

        async fetch(force = false) {

            const cartApi = useCartApi()

            if (this.initialized && !force) {
                return
            }

            this.loading = true
            this.loadingFetch = true

            try {
                const data = await cartApi.getCart()
                this.items = cleanItems(data)
                this.save()
            } catch (e) {
                console.error('Ошибка загрузки корзины:', e)
            } finally {
                this.loading = false
                this.loadingFetch = false
                this.initialized = true
            }

        },

        async add(newItem: any) {

            const cartApi = useCartApi()

            const id = String(newItem.id)

            if (!id) return

            this.loading = true
            this.loadingAdd = true

            const backup = JSON.parse(
                JSON.stringify(toRaw(this.items))
            )

            const current = this.items[id]

            this.items = {
                ...this.items,
                [id]: current
                    ? {
                        ...current,
                        qty: Number(current.qty) + Number(newItem.qty ?? 1)
                    }
                    : {
                        id,
                        name: newItem.name,
                        price: newItem.price,
                        qty: Number(newItem.qty ?? 1),
                        photo_url: newItem.photo_url || null
                    }
            }

            this.save()

            try {

                await cartApi.addItem({
                    id: Number(id),
                    qty: Number(newItem.qty ?? 1)
                })

            } catch (e) {

                console.error(e)

                this.items = backup

                this.save()
            } finally {
                this.loading = false
                this.loadingAdd = false
            }

        },

        updateLocal(id: string, qty: number) {

            if (!this.items[id]) return

            this.items = {
                ...this.items,
                [id]: {
                    ...this.items[id],
                    qty
                }
            }

            this.save()
        },

        async update(id: number | string, qty: number) {

            const cartApi = useCartApi()

            id = String(id)
            qty = Math.max(1, Number(qty))

            this.loadingUpdate = true

            this.updateLocal(id, qty)

            try {

                await cartApi.updateItem({
                    id: Number(id),
                    qty
                })

            } catch (e) {

                console.error(e)

            } finally {
                this.loadingUpdate = false
            }
        },

        async remove(id: number | string) {

            const cartApi = useCartApi()

            id = String(id)

            this.loadingRemove = true

            const backup = JSON.parse(
                JSON.stringify(toRaw(this.items))
            )

            delete this.items[id]

            this.save()

            try {

                await cartApi.removeItem(Number(id))

            } catch (e) {

                console.error(e)

                this.items = backup

                this.save()
            } finally {
                this.loadingRemove = false
            }

        },

        async clear() {

            const cartApi = useCartApi()

            this.loadingClear = true

            const backup = JSON.parse(
                JSON.stringify(toRaw(this.items))
            )

            this.items = {}

            this.save()

            try {
                await cartApi.clear()
            } catch (e) {
                console.error(e)
                this.items = backup
                this.save()
            } finally {
                this.loadingClear = false
            }

        },

        async checkout(payload: any = {}) {

            const cartApi = useCartApi()

            this.loadingCheckout = true

            const backup = JSON.parse(
                JSON.stringify(toRaw(this.items))
            )

            try {
                const data = await cartApi.checkout({
                    comment: payload.comment || null
                })
                this.items = {}
                this.save()
                return data
            } catch (e) {
                console.error(e)
                this.items = backup
                this.save()
                throw e
            } finally {
                this.loadingCheckout = false
            }

        }

    }

})
