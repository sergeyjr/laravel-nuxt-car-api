import axios from 'axios'
import { useAlertStore } from '~/stores/alert'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api = axios.create({
        baseURL: config.public.apiBase || '/',
        withCredentials: true,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        }
    })

    api.interceptors.request.use(config => {
        if (import.meta.client) {
            const token = localStorage.getItem('api_token')

            if (token) {
                config.headers = config.headers || {}
                config.headers.Authorization = `Bearer ${token}`
            }
        }

        return config
    })

    const IGNORE_ALERT_STATUSES = [401, 403]
    const IGNORE_ALERT_URLS = ['/api/me']

    api.interceptors.response.use(
        response => response,
        error => {
            const alert = useAlertStore()

            const status = error.response?.status
            const url = error.config?.url

            const isIgnoredStatus = IGNORE_ALERT_STATUSES.includes(status)
            const isIgnoredUrl = IGNORE_ALERT_URLS.some(u => url?.includes(u))

            if (status === 401) {
                if (import.meta.client) {
                    localStorage.removeItem('api_token')
                }
            }

            if (isIgnoredStatus || isIgnoredUrl) {
                return Promise.reject(error)
            }

            const message = error.response?.data?.message
            if (message) alert.add('error', message)

            const errors = error.response?.data?.errors
            if (errors) {
                Object.values(errors).forEach((arr: any) => {
                    arr.forEach((msg: string) =>
                        alert.add('error', msg)
                    )
                })
            }

            return Promise.reject(error)
        }
    )

    return {
        provide: { api }
    }
})
