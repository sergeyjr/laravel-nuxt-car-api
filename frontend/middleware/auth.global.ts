import {useProtected} from "~/composables/useProtected";

export default defineNuxtRouteMiddleware(async (to) => {

    if (to.path === '/' || to.path.startsWith('/public')) return

    const auth = useAuthStore()

    if (!auth.initialized) {
        await auth.initAuth()
    }

    const {requiresAuth} = useProtected()

    const needsAuth = requiresAuth(to.path)

    if (!needsAuth) {
        if (auth.isAuth) return
        if (to.path === '/login' && auth.isAuth) {
            return navigateTo('/dashboard')
        }
        return
    }

    if (needsAuth && !auth.isAuth) {
        return navigateTo('/login')
    }

})
