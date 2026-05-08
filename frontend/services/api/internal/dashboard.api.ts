import type {DashboardResponse} from "~/types/dashboard";

export const useDashboardApi = () => {

    const api = useApi()

    return {

        getDashboard() {
            return api.get<DashboardResponse>('/api/dashboard')
        }

    }
}

