export const useApi = () => {
    const { $api, $apiV1 } = useNuxtApp()

    return {
        api: $api,
        apiV1: $apiV1,
    }
}
