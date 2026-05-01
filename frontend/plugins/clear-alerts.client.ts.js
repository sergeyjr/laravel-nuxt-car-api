import { useAlertStore } from '~/stores/alert'

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()

    router.beforeEach(() => {
        const alerts = useAlertStore()
        alerts.clear()
    })
})
