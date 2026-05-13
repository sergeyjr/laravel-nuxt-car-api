import type { DashboardResponse } from "~/types/dashboard";

export const useDashboardApi = () => {

    const api = useApi()

    return {

        async getDashboard() {
            console.log('[DashboardAPI] getDashboard → request')
            try {
                const res = await api.get<DashboardResponse>('/api/dashboard')
                console.log('[DashboardAPI] getDashboard → response:', res)
                return res
            } catch (err) {
                console.error('[DashboardAPI] getDashboard → error:', err)
                throw err
            }
        }

    }

}
