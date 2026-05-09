export function useApiToken() {

    const {$apiToken} = useNuxtApp()

    return {

        get<T>(url: string, options: any = {}) {
            return $apiToken<T>(url, {
                ...options,
                method: 'GET'
            })
        },

        post<T>(
            url: string,
            body?: any,
            options: any = {}
        ) {
            return $apiToken<T>(url, {
                ...options,
                method: 'POST',
                body
            })
        },

        put<T>(
            url: string,
            body?: any,
            options: any = {}
        ) {
            return $apiToken<T>(url, {
                ...options,
                method: 'PUT',
                body
            })
        },

        patch<T>(
            url: string,
            body?: any,
            options: any = {}
        ) {
            return $apiToken<T>(url, {
                ...options,
                method: 'PATCH',
                body
            })
        },

        delete<T>(
            url: string,
            options: any = {}
        ) {
            return $apiToken<T>(url, {
                ...options,
                method: 'DELETE'
            })
        }

    }

}
