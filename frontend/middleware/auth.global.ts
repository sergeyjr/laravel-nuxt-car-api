import {useAuthStore} from '~/stores/auth'
import {useAuthApi} from '~/services/api/internal/auth.api'

export default defineNuxtRouteMiddleware(async (to) => {

    const auth = useAuthStore()

    const isDashboard = to.path.startsWith('/dashboard')
    const isLogin = to.path === '/login'

    // ---------------------------
    // SSR / server-safe init
    // ---------------------------

    if (import.meta.server) {

        if (isDashboard && !auth.isAuth) {
            return navigateTo('/login')
        }

        return
    }

    // ---------------------------
    // hydrate auth only once
    // ---------------------------

    if (!auth.initialized) {

        const authApi = useAuthApi()

        try {
            const res: any = await authApi.me()

            auth.user = res?.user ?? res

        } catch {
            auth.user = null
        } finally {
            auth.initialized = true
        }
    }

    // ---------------------------
    // guards
    // ---------------------------

    if (!auth.isAuth && isDashboard) {
        return navigateTo('/login')
    }

    if (auth.isAuth && isLogin) {
        return navigateTo('/dashboard')
    }

})
