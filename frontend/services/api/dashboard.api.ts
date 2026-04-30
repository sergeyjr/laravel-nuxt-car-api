import {useNuxtApp} from '#app'

export interface DashboardResponse {
    carsCount: number
    ordersCount: number
    orders: any[]
    cart: Record<string, any>
    cartTotal: number
}

export const dashboardApi = {
    fetch(): Promise<DashboardResponse> {
        const {$api} = useNuxtApp()
        return $api<DashboardResponse>('/dashboard')
    }
}
