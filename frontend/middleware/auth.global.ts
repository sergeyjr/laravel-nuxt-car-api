import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {

    const auth = useAuthStore()

    debugLog('[middleware] start', {
        path: to.path,
        initialized: auth.initialized,
        isAuth: auth.isAuth
    })

    const isDashboard = to.path.startsWith('/dashboard')
    const isLogin = to.path === '/login'

    if (!auth.initialized) {
        debugLog('[middleware] initAuth START')
        await auth.initAuth()
        debugLog('[middleware] initAuth END', {
            initialized: auth.initialized,
            isAuth: auth.isAuth
        })
    }

    if (!auth.isAuth && isDashboard) {
        debugLog('[middleware] redirect -> /login')
        return navigateTo('/login')
    }

    if (auth.isAuth && isLogin) {
        debugLog('[middleware] redirect -> /dashboard')
        return navigateTo('/dashboard')
    }

    debugLog('[middleware] pass')

})
