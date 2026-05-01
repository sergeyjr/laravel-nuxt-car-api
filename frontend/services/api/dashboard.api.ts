import {useNuxtApp} from '#app'

export interface DashboardResponse {
    orders: any[]
    ordersCount: number
    carsCount: number
    cart: Record<string, any>
    cartTotal: number
}

function api() {
    return useNuxtApp().$api
}

export const dashboardApi = {
    getDashboard(): Promise<DashboardResponse> {
        return api()('/dashboard')
    }
}
