import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()

    const isDashboard = to.path.startsWith('/dashboard')
    const isLogin = to.path === '/login'

    console.log('[mw]', to.fullPath, {
        initialized: auth.initialized,
        isAuth: auth.isAuth
    })

    if (import.meta.server) {
        const token = auth.getToken()

        if (isDashboard && !token) {
            return navigateTo('/login')
        }

        return
    }

    await auth.initAuth()

    if (!auth.isAuth && isDashboard) {
        return navigateTo('/login')
    }

    if (auth.isAuth && isLogin) {
        return navigateTo('/dashboard')
    }
})
