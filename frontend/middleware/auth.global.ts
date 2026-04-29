import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {

    const auth = useAuthStore()

    if (!auth) return

    const isAuth = auth.isAuth

    if (!isAuth && to.path.startsWith('/dashboard')) {
        return navigateTo('/login')
    }

})
