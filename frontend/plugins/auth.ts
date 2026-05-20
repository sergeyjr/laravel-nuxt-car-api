export default defineNuxtPlugin(async () => {

    debugLog('[Auth Plugin] init')

    const authStore = useAuthStore()
    const route = useRoute()
    const localePath = useLocalePath()

    if (!authStore.initialized) {
        debugLog('[Auth Plugin] initAuth')
        await authStore.initAuth()
    }

    // login path с учётом текущей локали
    const loginPath = localePath('/login')
    const dashboardPath = localePath('/dashboard')

    // авторизованный пользователь не должен видеть login
    if (authStore.isAuth && route.path === loginPath) {
        debugLog('[Auth Plugin] redirect auth user from login')
        await navigateTo(dashboardPath, {replace: true})
    }

})
