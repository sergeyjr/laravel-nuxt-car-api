import {useApi} from '~/composables/useApi'

export interface DashboardResponse {
    orders: any[]
    ordersCount: number
    carsCount: number
    cart: Record<string, any>
    cartTotal: number
}

export const useDashboardApi = () => {

    const { api } = useApi()

    return {

        getDashboard(): Promise<DashboardResponse> {
            return api('/dashboard')
        }

    }

}
