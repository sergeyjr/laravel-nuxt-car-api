import type {ContactPayload, ContactResponse} from '~/types/contacts'

export const useContactApi = () => {

    const api = useApi()

    return {

        submit(payload: ContactPayload) {
            debugLog('[ContactAPI] submit → request')
            return api.post<ContactResponse>('/api/contact', payload)
        }

    }

}
