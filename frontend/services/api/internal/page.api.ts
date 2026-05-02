import {useNuxtApp} from '#app'

export interface PageResponse {
    id: number
    code: string
    title: string
    content: string
}

function api() {
    return useNuxtApp().$api
}

export const pageApi = {

    fetchPage(code: string): Promise<PageResponse> {
        return api()(`/page/${code}`)
    }

}
