export default defineNuxtPlugin(async () => {

    const auth = useAuthStore()
    const route = useRoute()

    console.log('[auth plugin] start', {
        initialized: auth.initialized,
        user: auth.user
    })

    if (!auth.initialized) {
        console.log('[auth plugin] initAuth called')
        await auth.initAuth()

        console.log('[auth plugin] initAuth finished', {
            initialized: auth.initialized,
            isAuth: auth.isAuth,
            user: auth.user
        })
    }

    if (auth.isAuth && route.path === '/login') {
        await navigateTo('/dashboard', {replace: true})
    }

})
