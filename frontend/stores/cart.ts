import { defineStore } from 'pinia'

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
        getApi() {
            return useNuxtApp().$api
        },

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
            const api = this.getApi()

            if (this.initialized && !force) return

            if (!force && Object.keys(this.items).length > 0) {
                this.initialized = true
                return
            }

            try {
                const { data } = await api.get('/api/cart')
                const serverItems = cleanItems(data)

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
            const api = this.getApi()

            const id = newItem.id
            const backup = structuredClone(this.items)

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
                await api.get('/sanctum/csrf-cookie')
                await api.post('/api/cart/add', {
                    id,
                    qty: newItem.qty ?? 1
                })
            } catch (e) {
                this.items = backup
                this.save()
            }
        },

        async update(id: number, qty: number) {
            if (!id || qty < 1) return

            const api = this.getApi()
            const backup = structuredClone(this.items)

            if (this.items[id]) {
                this.items[id].qty = qty
            }

            this.save()

            try {
                await api.get('/sanctum/csrf-cookie')
                await api.post('/api/cart/update', { id, qty })
            } catch (e) {
                this.items = backup
                this.save()
            }
        },

        async remove(id: number) {
            const api = this.getApi()
            const backup = structuredClone(this.items)

            delete this.items[id]
            this.save()

            try {
                await api.get('/sanctum/csrf-cookie')
                await api.post('/api/cart/remove', { id })
            } catch (e) {
                this.items = backup
                this.save()
            }
        },

        async clear() {
            const api = this.getApi()
            const backup = structuredClone(this.items)

            this.items = {}
            this.save()

            try {
                await api.get('/sanctum/csrf-cookie')
                await api.post('/api/cart/clear')
            } catch (e) {
                this.items = backup
                this.save()
            }
        },

        async checkout(payload: any = {}) {
            const api = this.getApi()
            const backup = structuredClone(this.items)

            try {
                await api.get('/sanctum/csrf-cookie')

                const { data } = await api.post('/api/orders/checkout', {
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
