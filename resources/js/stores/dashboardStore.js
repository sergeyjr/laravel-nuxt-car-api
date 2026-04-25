import { defineStore } from 'pinia'
import { api } from '@/api'

export const useDashboardStore = defineStore('dashboard', {

    state: () => ({
        orders: [],
        ordersCount: 0,
        carsCount: 0,

        cart: {},
        cartTotal: 0,

        loading: false,
        loaded: false,
        error: null
    }),

    actions: {

        async fetchDashboard() {
            this.loading = true

            try {
                const [carsRes, ordersRes, cartRes] = await Promise.all([
                    api.get('/api/dashboard/cars'),
                    api.get('/api/orders'),
                    api.get('/api/cart')
                ])

                // CARS
                this.carsCount = carsRes.data.count || 0

                // ORDERS
                this.ordersCount = ordersRes.data.length || 0

                this.orders = ordersRes.data
                    .sort((a, b) =>
                        new Date(b.created_at) - new Date(a.created_at)
                    )
                    .slice(0, 3)

                // CART
                this.cart = cartRes.data.items || {}

                this.cartTotal = cartRes.data.total || 0

                this.loaded = true

            } catch (e) {
                this.error = e
                console.error('Dashboard error:', e)

            } finally {
                this.loading = false
            }
        }

    }

})
