import type {DashboardResponse} from "~/types/dashboard";

export const useDashboardApi = () => {

    const api = useApi()

    return {

        getDashboard() {
            console.log('[DashboardAPI] getDashboard → request')
            const res = api.get<DashboardResponse>('/api/dashboard')
            console.log('[DashboardAPI] getDashboard → response', res)
            return res
        }

    }

}

