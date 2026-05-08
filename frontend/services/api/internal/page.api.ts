export interface PageResponse {
    id: number
    code: string
    title: string
    content: string
}

export const usePageApi = () => {

    const api = useApi()

    return {

        fetchPage(code: string): Promise<PageResponse> {
            return api.get(`/page/${code}`)
        }

    }

}
