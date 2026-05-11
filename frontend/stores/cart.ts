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
        loading: false,
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

            if (!import.meta.client) return

            const raw = JSON.parse(
                localStorage.getItem('cartItems') || '{}'
            )

            this.items = cleanItems(raw)
            this.initialized = true
            this.hydrated = true

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

            try {
                const data = await cartApi.getCart()
                this.items = cleanItems(data)
                this.save()
            } catch (e) {
                console.error('Ошибка загрузки корзины:', e)
            } finally {
                this.loading = false
                this.initialized = true
            }

        },

        async add(newItem: any) {

            const cartApi = useCartApi()

            const id = String(newItem.id)

            if (!id) return

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

            // 1. сразу обновляем UI
            this.updateLocal(id, qty)

            try {

                // 2. сразу отправляем на сервер
                await cartApi.updateItem({
                    id: Number(id),
                    qty
                })

            } catch (e) {

                console.error(e)

                // (опционально) можно откатить — если нужно строго
                // await this.fetch(true)
            }
        },

        async remove(id: number | string) {

            const cartApi = useCartApi()

            id = String(id)

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
            }

        },

        async clear() {

            const cartApi = useCartApi()

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
            }

        },

        async checkout(payload: any = {}) {

            const cartApi = useCartApi()

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
            }

        }

    }

})
