import { useAuthStore } from '~/stores/auth'
import { debugLog } from '~/utils/debug'

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()

    const isDashboard = to.path.startsWith('/dashboard')
    const isLogin = to.path === '/login'

    debugLog('[mw] route:', to.fullPath)
    debugLog('[mw] state:', {
        initialized: auth.initialized,
        isAuth: auth.isAuth
    })

    if (!auth.initialized) {
        debugLog('[mw] initAuth start 1')
        await auth.initAuth()
        debugLog('[mw] initAuth finish 1')
    }

    if (import.meta.server) {
        const token = auth.getToken()

        debugLog('[mw][server] token:', token)

        if (isDashboard && !token) {
            debugLog('[mw][server] redirect -> /login2')
            return navigateTo('/login')
        }

        debugLog('[mw][client] isAuth:', auth.isAuth)

        return
    }

    debugLog('[mw][client] isAuth2:', auth.isAuth)

    if (!auth.isAuth && isDashboard) {
        debugLog('[mw][client] redirect -> /login1')
        return navigateTo('/login')
    }

    if (auth.isAuth && isLogin) {
        debugLog('[mw][client] redirect -> /dashboard3')
        return navigateTo('/dashboard')
    }
})
