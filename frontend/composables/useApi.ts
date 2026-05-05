export const useApi = () => {
    const { $api, $apiToken, $apiV1, $backend, $csrf} = useNuxtApp()

    return {
        api: $api,
        apiToken: $apiToken,
        apiV1: $apiV1,
        backend: $backend,
        csrf: $csrf,
    }
}
