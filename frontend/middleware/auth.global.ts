import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()

    if (!auth.initialized) {
        try {
            await auth.initAuth()
        } catch (e) {
            // игнор — просто считаем неавторизованным
        }
    }

    if (!auth.isAuth && to.path.startsWith('/dashboard')) {
        return navigateTo('/login')
    }
})
