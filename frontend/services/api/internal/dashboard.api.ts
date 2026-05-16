import type {DashboardResponse} from "~/types/dashboard";

export const useDashboardApi = () => {

    const api = useApi()

    return {

        async getDashboard() {
            console.log('[DashboardAPI] getDashboard → request')
            try {
                return await api.get<DashboardResponse>('/api/dashboard')
            } catch (err) {
                console.error('[DashboardAPI] getDashboard → error:', err)
                throw err
            }
        }

    }

}
