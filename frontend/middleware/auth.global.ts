import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()

    await auth.initAuth()

    if (!auth.isAuth && to.path !== '/login') {
        return navigateTo('/login')
    }

    if (auth.isAuth && to.path === '/login') {
        return navigateTo('/dashboard')
    }
})
