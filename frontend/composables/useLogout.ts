import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

export const useLogout = () => {

    const auth = useAuthStore()
    const cart = useCartStore()

    const logout = async (routePath: string) => {

        const ok = await auth.logout()

        if (!ok) {
            return false
        }

        cart.reset()

        const shouldRedirect =
            routePath.startsWith('/cart') ||
            routePath.startsWith('/dashboard') ||
            routePath.startsWith('/cars/create')

        if (shouldRedirect) {
            await navigateTo('/login')
        }

        return true
    }

    return {
        logout
    }
}
