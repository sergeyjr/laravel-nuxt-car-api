import {useNuxtApp} from '#app'

export const profileApi = {
    async update(fd: FormData): Promise<any> {
        const {$api} = useNuxtApp()

        await $api('/sanctum/csrf-cookie')

        return $api('/api/profile/update', {
            method: 'POST',
            body: fd
        })
    },

    async changePassword(payload: any): Promise<any> {
        const {$api} = useNuxtApp()

        await $api('/sanctum/csrf-cookie')

        return $api('/api/profile/password', {
            method: 'POST',
            body: payload
        })
    },

    async delete(): Promise<any> {
        const {$api} = useNuxtApp()

        await $api('/sanctum/csrf-cookie')

        return $api('/api/profile', {
            method: 'DELETE'
        })
    }
}
