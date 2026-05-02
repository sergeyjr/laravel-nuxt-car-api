import {useNuxtApp} from '#app'

export const useApiV1Client = () => {
    const {$apiV1} = useNuxtApp()
    return $apiV1
}
