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
            remove_avatar: false,
        },
        passwordForm: {
            current_password: '',
            password: '',
            password_confirmation: '',
        } as ProfilePasswordForm,
        errors: {} as Record<string, string>,
        loadingProfile: false,
        loadingAvatar: false,
        loadingDelete: false,
        loadingPassword: false,
        loadingAll: false,
        success: false,
        showAvatarModal: false,
    }),

    actions: {

        showAlert(type: string, message: string) {
            useAlertStore().add(type, message)
        },

        t(key?: string, params: Record<string, any> = {}) {
            const {$i18n} = useNuxtApp()
            if (!key) {
                return String($i18n.t('common.error', params))
            }
            return String($i18n.t(key, params))
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

        setError(field: string, message: string) {
            this.errors[field] = message
        },

        unwrapResponse(data: any) {
            return data?.data ?? data
        },

        resolveMessage(data: any, fallbackKey: string) {
            const messageKey = data?.message || fallbackKey
            return this.t(messageKey)
        },

        async updateProfile(payload: any): Promise<boolean> {
            const authStore = useAuthStore()
            const profileApi = useProfileApi()

            this.loadingAll = true
            this.loadingProfile = true
            this.resetErrors()

            try {
                const response: any = await profileApi.updateProfile(payload)
                const data = this.unwrapResponse(response)

                if (data?.user) {
                    authStore.user = data.user
                }

                this.showAlert(
                    'success',
                    this.resolveMessage(data, 'profile.updated'),
                )

                return true
            } catch (e: any) {
                const data = this.unwrapResponse(
                    e?.data || e?.response?._data || e?.response?.data || {},
                )

                if (e?.status === 422 && data?.errors) { // Ошибка валидации
                        Object.entries(data.errors).forEach(([k, v]: any) => {
                            this.setError(k, v[0])
                        })
                } else {
                    this.showAlert(
                        'error',
                        this.resolveMessage(data, 'common.error')
                    )
                }

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
                const response: any = await profileApi.changePassword(payload)
                const data = this.unwrapResponse(response)

                this.passwordForm = {
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                }

                this.success = true

                this.showAlert(
                    'success',
                    this.resolveMessage(data, 'profile.passwordUpdated'),
                )

                return true
            } catch (e: any) {
                const data = this.unwrapResponse(
                    e?.data || e?.response?._data || e?.response?.data || {},
                )

                if (e?.status === 422 && data?.errors) { // Ошибка валидации
                        Object.entries(data.errors).forEach(([k, v]: any) => {
                            this.setError(k, v[0])
                        })
                } else {
                    this.showAlert(
                        'error',
                        this.resolveMessage(data, 'common.error')
                    )                }

                return false
            } finally {
                this.loadingAll = false
                this.loadingPassword = false
            }
        },

        async deleteAccount(): Promise<boolean> {
            const authStore = useAuthStore()
            const router = useRouter()
            const profileApi = useProfileApi()

            this.loadingAll = true
            this.loadingDelete = true
            this.resetErrors()

            try {
                const response: any = await profileApi.delete()
                const data = this.unwrapResponse(response)

                authStore.user = null
                this.success = true

                this.showAlert(
                    'success',
                    this.resolveMessage(data, 'profile.deleted'),
                )

                const redirect = data?.redirect || '/'
                await router.push(redirect)

                return true
            } catch (e: any) {
                const data = this.unwrapResponse(
                    e?.data || e?.response?._data || e?.response?.data || {},
                )

                if (e?.status === 422 && data?.errors) { // Ошибка валидации
                        Object.entries(data.errors).forEach(([k, v]: any) => {
                            this.setError(k, v[0])
                        })
                } else {
                    this.showAlert(
                        'error',
                        this.resolveMessage(data, 'common.error')
                    )                }

                return false
            } finally {
                this.loadingAll = false
                this.loadingDelete = false
            }
        }

    }

})
