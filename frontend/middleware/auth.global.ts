import {useAuthStore} from '~/stores/auth'

import {useProtected} from '~/composables/useProtected'

export default defineNuxtRouteMiddleware((to) => {

    console.log('[Auth Global]', to.path)

    if (import.meta.server) {
        console.log('[Auth Global] server skip')
        return
    }

    const error = useError()

    if (error.value) {
        console.log('[Auth Global] error page skip')
        return
    }

    const authStore = useAuthStore()

    const {requiresAuth, normalizePath,} = useProtected()

    const localePath = useLocalePath()

    // путь без locale prefix
    const normalizedPath = normalizePath(to.path)

    const needsAuth = requiresAuth(to.path)

    console.log('[Auth Global] normalized:', normalizedPath)
    console.log('[Auth Global] requiresAuth:', needsAuth)
    console.log('[Auth Global] isAuth:', authStore.isAuth)

    if (!authStore.initialized) {
        console.log('[Auth Global] auth not initialized')
        return
    }

    const isCartPage = normalizedPath === '/cart' || normalizedPath.startsWith('/cart/')

    if (isCartPage && !authStore.isAuth) {
        console.log('[Auth Global] guest cart redirect')
        return navigateTo(localePath('/login'), {replace: true})
    }

    // public pages
    if (!needsAuth) {
        // auth user -> login redirect
        if (authStore.isAuth && normalizedPath === '/login') {
            console.log('[Auth Global] auth login redirect')
            return navigateTo(localePath('/dashboard'), {replace: true})
        }
        console.log('[Auth Global] public allowed')
        return
    }

    // protected pages
    if (!authStore.isAuth) {
        console.log('[Auth Global] protected denied')
        return navigateTo(localePath('/login'), {replace: true})
    }

    console.log('[Auth Global] protected allowed')

})
