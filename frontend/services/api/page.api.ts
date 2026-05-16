import type {PageResponse} from "~/types/page";

export const usePageApi = () => {

    const api = useApi()

    return {

        fetchPage(code: string) {
            console.log('[PageAPI] fetchPage → request')
            return api.get<PageResponse>(`/api/page/${code}`)
        }

    }

}
