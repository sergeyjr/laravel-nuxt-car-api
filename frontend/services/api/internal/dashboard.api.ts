import type { DashboardResponse } from '~/types/dashboard'
import {useApi} from '~/composables/useApi'

export const useDashboardApi = () => {

    const {apiToken} = useApi()

    return {

        async getDashboard(): Promise<DashboardResponse> {
            const res: any = await apiToken('/dashboard')
            return res?.data ?? res
        }

    }

}
