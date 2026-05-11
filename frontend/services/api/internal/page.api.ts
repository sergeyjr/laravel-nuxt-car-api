import type {PageResponse} from "~/types/page";

export const usePageApi = () => {

    const api = useApi()

    return {

        fetchPage(code: string) {
            return api.get<PageResponse>(`/api/page/${code}`)
        }

    }

}
