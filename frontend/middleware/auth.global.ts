import {useAuthStore} from '~/stores/auth'

import {useProtected} from '~/composables/useProtected'

export default defineNuxtRouteMiddleware(async (to) => {

    debugLog('[Auth Global]', to.path)

    const error = useError()

    if (error.value) {
        debugLog('[Auth Global] error page skip')
        return
    }

    const authStore = useAuthStore()

    const {requiresAuth, normalizePath,} = useProtected()

    const localePath = useLocalePath()

    // путь без locale prefix
    const normalizedPath = normalizePath(to.path)

    const needsAuth = requiresAuth(to.path)

    debugLog('[Auth Global] normalized:', normalizedPath)
    debugLog('[Auth Global] requiresAuth:', needsAuth)

    /* -----------------------------
       INIT AUTH BEFORE PAGE RENDER
    ------------------------------*/

    if (!authStore.initialized) {

        debugLog('[Auth Global] auth init start')

        try {
            await authStore.initAuth()

            debugLog('[Auth Global] auth init done')

        } catch (e) {

            debugLog('[Auth Global] auth init error')

            console.error(e)
        }
    }

    debugLog('[Auth Global] isAuth:', authStore.isAuth)

    const isCartPage = normalizedPath === '/cart' || normalizedPath.startsWith('/cart/')

    if (isCartPage && !authStore.isAuth) {
        debugLog('[Auth Global] guest cart redirect')

        return navigateTo(
            localePath('/login'),
            {
                replace: true
            }
        )
    }

    // public pages
    if (!needsAuth) {

        // auth user -> login redirect
        if (authStore.isAuth && normalizedPath === '/login') {
            debugLog('[Auth Global] auth login redirect')

            return navigateTo(
                localePath('/dashboard'),
                {
                    replace: true
                }
            )
        }

        debugLog('[Auth Global] public allowed')

        return
    }

    // protected pages
    if (!authStore.isAuth) {

        debugLog('[Auth Global] protected denied')

        return navigateTo(
            localePath('/login'),
            {
                replace: true
            }
        )
    }

    debugLog('[Auth Global] protected allowed')

})
