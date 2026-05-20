import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

import {useProtected} from '~/composables/useProtected'

export const useLogout = () => {

    debugLog('[useLogout] init')

    const authStore = useAuthStore()
    const cartStore = useCartStore()

    const localePath = useLocalePath()

    const {normalizePath} = useProtected()

    const logout = async (routePath: string) => {

        debugLog('[useLogout] logout start', routePath)

        const ok = await authStore.logout()

        if (!ok) {
            debugLog('[useLogout] logout failed')
            return false
        }

        cartStore.reset()

        const normalizedPath = normalizePath(routePath)

        const shouldRedirect =
            normalizedPath.startsWith('/cart') ||
            normalizedPath.startsWith('/dashboard')

        debugLog('[useLogout] normalized:', normalizedPath)
        debugLog('[useLogout] shouldRedirect:', shouldRedirect)

        if (shouldRedirect) {
            debugLog('[useLogout] redirect login')
            await navigateTo(localePath('/login'))
        }

        return true
    }

    return {
        logout
    }
}
