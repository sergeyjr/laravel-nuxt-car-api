import type {DashboardResponse} from "~/types/dashboard";

export const useDashboardApi = () => {

    const api = useApi()

    return {

        getDashboard() {
            console.log('[DashboardAPI] getDashboard → request')
            return api.get<DashboardResponse>('/api/dashboard')
        }

    }

}

