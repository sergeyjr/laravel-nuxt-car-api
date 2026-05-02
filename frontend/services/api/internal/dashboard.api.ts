import {useNuxtApp} from '#app'

export interface DashboardResponse {
    orders: any[]
    ordersCount: number
    carsCount: number
    cart: Record<string, any>
    cartTotal: number
}

function authApiClient() {
    return useNuxtApp().$authApiClient
}

export const dashboardApi = {

    getDashboard(): Promise<DashboardResponse> {
        return authApiClient()('/dashboard')
    }

}
