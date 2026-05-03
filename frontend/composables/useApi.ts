export const useApi = () => {
    const { $api, $apiV1, $authApiClient } = useNuxtApp()

    return {
        api: $api,
        apiV1: $apiV1,
        authApi: $authApiClient
    }
}
