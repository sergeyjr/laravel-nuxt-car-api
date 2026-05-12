import {useAuthStore} from '~/stores/auth'

export function useAuthActions() {

    const auth = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    const handleLogout = async () => {
        try {
            const ok = await auth.logout()

            if (!ok) {
                return false
            }

            const path = route.path

            if (
                path.startsWith('/cart') ||
                path.startsWith('/dashboard') ||
                path.startsWith('/cars/create')
            ) {
                await router.push('/login')
            }

            return true
        } catch (e) {
            console.error('Запрос на выход из системы не удался:', e)
            return false
        }
    }

    return {
        handleLogout
    }

}
