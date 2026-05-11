export default defineNuxtPlugin(async () => {

    const auth = useAuthStore()

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

    } else {
        console.log('[auth plugin] skipped (already initialized)')
    }

})
