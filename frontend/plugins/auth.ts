export default defineNuxtPlugin(async () => {

    const auth = useAuthStore()

    const route = useRoute()

    if (!auth.initialized) {
        await auth.initAuth()
    }

    if (auth.isAuth && route.path === '/login') {
        await navigateTo('/dashboard', {replace: true})
    }

})
