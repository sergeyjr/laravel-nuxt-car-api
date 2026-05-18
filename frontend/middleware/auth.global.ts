import {useAuthStore} from '~/stores/auth'

import {useProtected} from '~/composables/useProtected'

export default defineNuxtRouteMiddleware((to) => {
    console.log('[AUTH GLOBAL]')

    if (import.meta.server) {
        console.log('[AUTH GLOBAL] 0')
        return
    }

    const error = useError()
    if (error.value) {
        return
    }

    const auth = useAuthStore()

    const {requiresAuth} = useProtected()
    const needsAuth = requiresAuth(to.path)
    const localePath = useLocalePath()

    if (!auth.initialized) {
        console.log('[AUTH GLOBAL] 1')
        return
    }

    const isCartPage = to.path.includes('/cart')

    if (isCartPage && !auth.isAuth) {
        console.log('[AUTH GLOBAL] 2')
        return navigateTo(localePath('/login'), { replace: true })
    }

    if (!needsAuth) {
        if (auth.isAuth && to.path === '/login') {
            console.log('[AUTH GLOBAL] 3')
            return navigateTo(localePath('/'), {replace: true})
        }
        console.log('[AUTH GLOBAL] 4')
        return
    }

    if (!auth.isAuth) {
        console.log('[AUTH GLOBAL] 5')
        return navigateTo(localePath('/login'), {replace: true})
    }

    console.log('[AUTH GLOBAL] 6')

})
