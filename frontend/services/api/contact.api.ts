import {useNuxtApp} from '#app'

function api() {
    return useNuxtApp().$api
}

export const contactApi = {

    submit(payload: any) {
        return api()('/sanctum/csrf-cookie').then(() =>
            api()('/api/contact', {
                method: 'POST',
                body: payload
            })
        )
    }

}
