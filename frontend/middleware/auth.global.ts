import { useApiClient } from '~/composables/useApiClient'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {

    const auth = useAuthStore()

    if (import.meta.server) {
        if (!auth.initialized) {
            auth.initialized = true
        }
        if (!auth.isAuth && to.path.startsWith('/dashboard')) {
            return navigateTo('/login')
        }
        return
    }

    if (!auth.initialized) {
        const api = useApiClient()

        try {
            const res: any = await api('/me')
            auth.user = res?.user ?? res
        } catch {
            auth.user = null
        } finally {
            auth.initialized = true
        }
    }

    if (!auth.isAuth && to.path.startsWith('/dashboard')) {
        return navigateTo('/login')
    }

    if (auth.isAuth && to.path === '/login') {
        return navigateTo('/dashboard')
    }

})
