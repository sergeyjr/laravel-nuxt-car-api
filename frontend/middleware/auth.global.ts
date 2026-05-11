import {useProtected} from "~/composables/useProtected"
import {useAuthStore} from "~/stores/auth"

export default defineNuxtRouteMiddleware(async (to) => {

    console.log('[middleware] enter:', to.path)

    if (to.path === '/' || to.path.startsWith('/public')) {
        console.log('[middleware] skipped (public route)')
        return
    }

    const auth = useAuthStore()

    console.log('[middleware] auth state:', {
        initialized: auth.initialized,
        isAuth: auth.isAuth
    })

    // if (!auth.initialized) {
    //     console.log('[middleware] initAuth called')
    //     await auth.initAuth()
    //     console.log('[middleware] initAuth finished:', {
    //         initialized: auth.initialized,
    //         isAuth: auth.isAuth
    //     })
    // }

    const {requiresAuth} = useProtected()
    const needsAuth = requiresAuth(to.path)

    console.log('[middleware] route check:', {
        path: to.path,
        needsAuth,
        isAuth: auth.isAuth
    })

    if (!needsAuth) {
        console.log('[middleware] public route logic')

        if (auth.isAuth && to.path === '/login') {
            console.log('[middleware] redirect login → dashboard')
            return navigateTo('/dashboard')
        }

        return
    }

    if (needsAuth && !auth.isAuth) {
        console.log('[middleware] redirect → login')
        return navigateTo('/login')
    }

    console.log('[middleware] allowed')
})
