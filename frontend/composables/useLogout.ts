import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

import {useProtected} from '~/composables/useProtected'

export const useLogout = () => {

    console.log('[useLogout] init')

    const authStore = useAuthStore()
    const cartStore = useCartStore()

    const localePath = useLocalePath()

    const {normalizePath} = useProtected()

    const logout = async (routePath: string) => {

        console.log('[useLogout] logout start', routePath)

        const ok = await authStore.logout()

        if (!ok) {
            console.log('[useLogout] logout failed')
            return false
        }

        cartStore.reset()

        const normalizedPath = normalizePath(routePath)

        const shouldRedirect =
            normalizedPath.startsWith('/cart') ||
            normalizedPath.startsWith('/dashboard') ||
            normalizedPath.startsWith('/cars/create')

        console.log('[useLogout] normalized:', normalizedPath)
        console.log('[useLogout] shouldRedirect:', shouldRedirect)

        if (shouldRedirect) {
            console.log('[useLogout] redirect login')
            await navigateTo(localePath('/login'))
        }

        return true
    }

    return {
        logout
    }
}
