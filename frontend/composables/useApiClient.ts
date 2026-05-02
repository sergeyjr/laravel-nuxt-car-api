import {useNuxtApp} from '#app'

export const useApiClient = () => {
    const {$api} = useNuxtApp()
    return $api
}
