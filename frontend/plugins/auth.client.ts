export default defineNuxtPlugin(async () => {

    console.log('auth.client')

    const auth = useAuthStore()

    if (!auth.initialized) {
        await auth.initAuth()
    }

})
