import {useProtected} from "~/composables/useProtected";

export default defineNuxtRouteMiddleware(async (to) => {

    const config = useRuntimeConfig()

    if (import.meta.dev) {
        console.log('[middleware] route:', to.path)
    }

    if (to.path === '/' || to.path.startsWith('/public')) return

    const auth = useAuthStore()

    if (!auth.initialized) {
        await auth.initAuth()
    }

    const {requiresAuth} = useProtected()

    const needsAuth = requiresAuth(to.path)

    console.log('[middleware] auth state before init:', {
        initialized: auth.initialized,
        isAuth: auth.isAuth,
        user: auth.user
    })

    if (!needsAuth) {
        if (auth.isAuth) return
        if (to.path === '/login' && auth.isAuth) {
            console.log('[middleware] redirect login -> dashboard')
            return navigateTo('/dashboard')
        }
        console.log('[middleware] allow public route')
        return
    }

    if (needsAuth && !auth.isAuth) {
        console.log('[middleware] blocked -> redirect to login')
        return navigateTo('/login')
    }

    console.log('[middleware] access granted')

})
