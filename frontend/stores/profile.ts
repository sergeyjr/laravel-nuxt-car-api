import {defineStore} from 'pinia'
import {useAuthStore} from './auth'
import {useAlertStore} from './alert'
import {useProfileApi} from '~/services/api/internal/profile.api'

export const useProfileStore = defineStore('profile', {

    state: () => ({
        updateForm: {
            name: '',
            email: '',
            avatar: null as File | null,
            remove_avatar: false
        },

        passwordForm: {
            current_password: '',
            password: '',
            password_confirmation: ''
        },

        errors: {} as Record<string, string[] | string>,

        loadingProfile: false,
        loadingAvatar: false,
        loadingDelete: false,
        loadingPassword: false,
        loadingAll: false,

        success: false,

        showAvatarModal: false
    }),

    actions: {

        load(user: any) {
            if (!user) return

            this.updateForm.name = user.name
            this.updateForm.email = user.email
            this.updateForm.avatar = null
            this.updateForm.remove_avatar = false
        },

        onFile(e: Event) {
            const target = e.target as HTMLInputElement
            const file = target.files?.[0] || null

            this.updateForm.avatar = file

            if (file) {
                this.updateForm.remove_avatar = false
            }
        },

        openAvatar() {
            this.showAvatarModal = true
        },

        closeAvatar() {
            this.showAvatarModal = false
        },

        resetErrors() {
            this.errors = {}
        },

        async updateProfile(payload: any) {

            const alert = useAlertStore()
            const auth = useAuthStore()
            const profileApi = useProfileApi()

            this.loadingAll = true
            this.loadingProfile = true
            this.resetErrors()

            try {

                const data: any = await profileApi.updateProfile(payload)

                if (data?.user) {
                    auth.user = data.user
                }

                alert.add('success', data?.message || 'Профиль обновлён.')

            } catch (e: any) {

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                    return
                }

                alert.add('error', 'Ошибка обновления профиля.')

            } finally {
                this.loadingAll = false
                this.loadingProfile = false
            }
        },

        async changePassword(payload: typeof this.passwordForm) {

            const alert = useAlertStore()
            const profileApi = useProfileApi()

            this.loadingAll = true
            this.loadingPassword = true
            this.resetErrors()

            try {
                const data: any = await profileApi.changePassword(payload)
                this.passwordForm = {
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                }

                this.success = true

                alert.add('success', data?.message || 'Пароль обновлён.')

            } catch (e: any) {

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                    return
                }

                alert.add('error', 'Ошибка смены пароля.')

            } finally {
                this.loadingAll = false
                this.loadingPassword = false
            }

        },

        async deleteAccount() {

            const alert = useAlertStore()
            const auth = useAuthStore()
            const router = useRouter()
            const profileApi = useProfileApi()

            this.loadingAll = true
            this.loadingDelete = true
            this.resetErrors()

            try {
                const data: any = await profileApi.delete()

                auth.user = null
                this.success = true

                alert.add('success', data?.message || 'Аккаунт удален.')

                await router.push('/')

            } catch (e: any) {

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                    return
                }

                alert.add('error', 'Ошибка удаления аккаунта')

            } finally {
                this.loadingAll = false
                this.loadingDelete = false
            }
        }

    }

})
