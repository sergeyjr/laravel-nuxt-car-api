import type {PageResponse} from "~/types/page";

export const usePageApi = () => {

    const api = useApi()

    return {

        fetchPage(code: string) {
            console.log('[PageAPI] fetchPage → request', code)
            const res = api.get<PageResponse>(`/api/page/${code}`)
            console.log('[PageAPI] fetchPage → response', res)
            return res
        }

    }

}
