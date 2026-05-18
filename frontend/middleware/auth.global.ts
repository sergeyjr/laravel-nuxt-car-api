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
    const localePath = useLocalePath()

    if (!auth.initialized) {
        return
    }

    const isCartPage = to.path.includes('/cart')

    if (isCartPage && !auth.isAuth) {
        return navigateTo(localePath('/login'), { replace: true })
    }

    if (!needsAuth) {
        if (auth.isAuth && to.path === '/login') {
            return navigateTo('/dashboard', {replace: true})
        }
        return
    }

    if (!auth.isAuth) {
        return navigateTo(localePath('/login'), {replace: true})
    }

})
