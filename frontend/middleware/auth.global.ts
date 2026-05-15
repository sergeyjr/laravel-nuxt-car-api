import {useAuthStore} from '~/stores/auth'

import {useProtected} from '~/composables/useProtected'

export default defineNuxtRouteMiddleware((to) => {

    if (import.meta.server) return

    const error = useError()
    if (error.value) {
        return
    }

    const auth = useAuthStore()
    const {requiresAuth} = useProtected()
    const needsAuth = requiresAuth(to.path)

    console.log('[middleware] enter:', to.path)
    console.log('[middleware] auth state:', {
        initialized: auth.initialized,
        isAuth: auth.isAuth
    })
    console.log('[middleware] route check:', {
        path: to.path,
        needsAuth,
        isAuth: auth.isAuth
    })

    if (!auth.initialized) {
        console.log('[middleware] skip until auth initialized')
        return
    }

    if (!needsAuth) {
        console.log('[middleware] public route logic')

        if (auth.isAuth && to.path === '/login') {
            console.log('[middleware] redirect login → dashboard')
            return navigateTo('/dashboard', {replace: true})
        }

        return
    }

    if (!auth.isAuth) {
        console.log('[middleware] redirect → login')
        return navigateTo('/login', {replace: true})
    }

    console.log('[middleware] allowed')

})
