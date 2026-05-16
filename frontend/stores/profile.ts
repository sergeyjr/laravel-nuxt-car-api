import {defineStore} from 'pinia'
import {useAuthStore} from './auth'
import {useAlertStore} from './alert'
import {useProfileApi} from '~/services/api/profile.api'

type ProfilePasswordForm = {
    current_password: string
    password: string
    password_confirmation: string
}

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
        } as ProfilePasswordForm,
        errors: {} as Record<string, string>,
        loadingProfile: false,
        loadingAvatar: false,
        loadingDelete: false,
        loadingPassword: false,
        loadingAll: false,
        success: false,
        showAvatarModal: false
    }),

    actions: {

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

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

        normalizeErrors(errors: any): Record<string, string> {
            return Object.fromEntries(
                Object.entries(errors || {}).map(([k, v]) => [
                    k,
                    Array.isArray(v) ? (v[0] ?? '') : String(v ?? ''),
                ]),
            )
        },

        async updateProfile(payload: any): Promise<boolean> {

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

                this.showAlert('success', data?.message || 'Профиль обновлён.')

                return true
            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = this.normalizeErrors(e.data?.errors)
                    return false
                }

                this.showAlert('error', 'Ошибка обновления профиля.')

                return false
            } finally {
                this.loadingAll = false
                this.loadingProfile = false
            }
        },

        async changePassword(payload: ProfilePasswordForm): Promise<boolean> {

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

                this.showAlert('success', data?.message || 'Пароль обновлён.')

                return true

            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = this.normalizeErrors(e.data?.errors)
                    return false
                }

                this.showAlert('error', 'Ошибка смены пароля.')

                return false
            } finally {
                this.loadingAll = false
                this.loadingPassword = false
            }

        },

        async deleteAccount(): Promise<boolean> {

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

                this.showAlert('success', data?.message || 'Аккаунт удален.')

                await router.push('/')

                return true
            } catch (e: any) {
                if (e?.status === 422) {
                    this.errors = this.normalizeErrors(e.data?.errors)
                    return false
                }

                this.showAlert('error', 'Ошибка удаления аккаунта')

                return false
            } finally {
                this.loadingAll = false
                this.loadingDelete = false
            }
        }

    }

})
