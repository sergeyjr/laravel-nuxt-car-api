import { useNuxtApp } from '#app'

type ApiOptions = Parameters<ReturnType<typeof useNuxtApp>['$api']>[1] & {
    skipCsrf?: boolean
}

export function useApiClient() {
    const api = useNuxtApp().$api

    return (url: string, options: ApiOptions = {}) => {
        return api(url, options as any)
    }
}
