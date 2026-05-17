export default defineNuxtPlugin(async () => {

    const auth = useAuthStore()
    const route = useRoute()
    const localePath = useLocalePath()

    if (!auth.initialized) {
        await auth.initAuth()
    }

    const loginPath = localePath('/login')

    if (auth.isAuth && route.path === loginPath) {
        await navigateTo(localePath('/dashboard'), { replace: true })
    }

})
