import {useApi} from '~/composables/useApi'

export const useContactApi = () => {

    const {api} = useApi()

    return {

        submit(payload: any) {
            return api('/contact', {
                method: 'POST',
                body: payload
            })
        }

    }

}
