import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {

    const auth = useAuthStore()

    const isDashboard = to.path.startsWith('/dashboard')
    const isLogin = to.path === '/login'

    if (!auth.initialized) {
        await auth.initAuth()
    }

    if (!auth.isAuth && isDashboard) {
        return navigateTo('/login')
    }

    if (auth.isAuth && isLogin) {
        return navigateTo('/dashboard')
    }

})
