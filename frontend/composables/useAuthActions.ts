import {useAuthStore} from '~/stores/auth'
import {useRouter, useRoute} from 'vue-router'

export function useAuthActions() {

    const auth = useAuthStore()

    const router = useRouter()

    const route = useRoute()

    const handleLogout = async () => {

        if (import.meta.client) {
            const confirmed = window.confirm('Вы уверены, что хотите выйти?')
            if (!confirmed) {
                return
            }
        }

        try {
            await auth.logout()
        } catch (e) {
            console.error('Запрос на выход из системы не удался:', e)
        }

        const path = route.path

        if (
            path.startsWith('/dashboard') ||
            path.startsWith('/cars/create')
        ) {
            await router.push('/login')
        }

    }

    return {
        handleLogout
    }

}
