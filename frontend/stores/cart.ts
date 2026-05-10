import {defineStore} from 'pinia'
import {toRaw} from 'vue'
import {useCartApi} from '~/services/api/internal/cart.api'

function cleanItems(obj: any) {
    return Object.fromEntries(
        Object.entries(obj || {}).filter(([_, item]) => item != null)
    )
}

export const useCartStore = defineStore('cart', {

    state: () => ({
        items: {} as Record<string, any>,
        initialized: false
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
            if (!import.meta.client) return

            const raw = JSON.parse(localStorage.getItem('cartItems') || '{}')
            this.items = cleanItems(raw)
        },

        save() {
            if (!import.meta.client) return
            localStorage.setItem('cartItems', JSON.stringify(this.items))
        },

        async fetch(force = false) {
            const cartApi = useCartApi()

            if (this.initialized && !force) return

            if (!force && Object.keys(this.items).length > 0) {
                this.initialized = true
                return
            }

            try {
                debugLog('[fetch] getCart')
                const data = await cartApi.getCart()
                const serverItems = cleanItems(data)
                debugLog('getCart data', data)

                if (Object.keys(serverItems).length > 0) {
                    this.items = serverItems
                    this.save()
                }
            } catch (e) {
                console.error('Ошибка загрузки корзины:', e)
            } finally {
                this.initialized = true
            }
        },

        async add(newItem: any) {
            const cartApi = useCartApi()

            const id = Number(newItem?.id)
            if (!id) {
                console.error('Cart add aborted: invalid id', newItem)
                return
            }

            const backup = structuredClone(toRaw(this.items))

            if (this.items[id]) {
                this.items[id].qty += newItem.qty ?? 1
            } else {
                this.items[id] = {
                    id,
                    name: newItem.name,
                    price: newItem.price,
                    qty: newItem.qty ?? 1,
                    photo_url: newItem.photo_url || null
                }
            }

            this.save()

            try {
                await cartApi.addItem({
                    id,
                    qty: newItem.qty ?? 1
                })
            } catch {
                this.items = backup
                this.save()
            }
        },

        async update(id: number, qty: number) {
            const cartApi = useCartApi()

            if (!id || qty < 1) return

            const backup = structuredClone(toRaw(this.items))

            if (this.items[id]) {
                this.items[id].qty = qty
            }

            this.save()

            try {
                await cartApi.updateItem({id, qty})
            } catch (e) {
                this.items = backup
                this.save()
            }
        },

        async remove(id: number) {
            const cartApi = useCartApi()

            const backup = structuredClone(toRaw(this.items))

            delete this.items[id]
            this.save()

            try {
                await cartApi.removeItem(id)
            } catch (e) {
                this.items = backup
                this.save()
            }
        },

        async clear() {
            const cartApi = useCartApi()

            const backup = structuredClone(toRaw(this.items))

            this.items = {}
            this.save()

            try {
                await cartApi.clear()
            } catch (e) {
                this.items = backup
                this.save()
            }
        },

        async checkout(payload: any = {}) {
            const cartApi = useCartApi()

            const backup = structuredClone(toRaw(this.items))

            try {
                const data = await cartApi.checkout({
                    comment: payload.comment || null
                })

                this.items = {}
                this.save()

                return data
            } catch (e) {
                this.items = backup
                this.save()
                throw e
            }
        }

    }

})
