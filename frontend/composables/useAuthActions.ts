import { useAuthStore } from '~/stores/auth'

export const useAuthActions = () => {
    const auth = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    const handleLogout = async () => {
        const confirmed = confirm('Вы уверены, что хотите выйти?')
        if (!confirmed) return

        try {
            await auth.logout()
        } catch (e) {
            console.warn('Logout request failed:', e)
        }

        const path = route.path

        if (
            path.startsWith('/dashboard') ||
            path.startsWith('/cars/create')
        ) {
            await router.push('/login')
        }
    }

    return { handleLogout }
}
