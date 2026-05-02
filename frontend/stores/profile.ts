import {defineStore} from 'pinia'
import {useAuthStore} from './auth'
import {useAlertStore} from './alert'
import {profileApi} from '~/services/api/internal/profile.api'

export const useProfileStore = defineStore('profile', {
    state: () => ({
        form: {
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

        loading: false,
        success: false,

        showAvatarModal: false
    }),

    actions: {

        // --- LOAD ---
        load(user: any) {
            if (!user) return

            this.form.name = user.name
            this.form.email = user.email
            this.form.avatar = null
            this.form.remove_avatar = false
        },

        // --- FILE ---
        onFile(e: Event) {
            const target = e.target as HTMLInputElement
            const file = target.files?.[0] || null

            this.form.avatar = file

            if (file) {
                this.form.remove_avatar = false
            }
        },

        // --- MODAL ---
        openAvatar() {
            this.showAvatarModal = true
        },

        closeAvatar() {
            this.showAvatarModal = false
        },

        // --- ERRORS ---
        resetErrors() {
            this.errors = {}
        },

        // --- UPDATE PROFILE ---
        async updateProfile() {
            const alert = useAlertStore()
            const auth = useAuthStore()

            this.loading = true
            this.resetErrors()

            try {
                const fd = new FormData()

                fd.append('name', this.form.name)
                fd.append('email', this.form.email)

                if (this.form.avatar) {
                    fd.append('avatar', this.form.avatar)
                }

                if (this.form.remove_avatar) {
                    fd.append('remove_avatar', '1')
                }

                const data: any = await profileApi.update(fd)

                if (data?.user) {
                    auth.user = data.user
                }

                this.form.avatar = null
                this.form.remove_avatar = false
                this.success = true

                alert.add('success', data?.message || 'Профиль обновлён')

            } catch (e: any) {

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                    return
                }

                alert.add('error', 'Ошибка обновления профиля')

            } finally {
                this.loading = false
            }
        },

        // --- CHANGE PASSWORD ---
        async changePassword() {
            const alert = useAlertStore()

            this.loading = true
            this.resetErrors()

            try {
                const data: any = await profileApi.changePassword(this.passwordForm)

                this.passwordForm = {
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                }

                this.success = true

                alert.add('success', data?.message || 'Пароль обновлён')

            } catch (e: any) {

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                    return
                }

                alert.add('error', 'Ошибка смены пароля')

            } finally {
                this.loading = false
            }
        },

        // --- DELETE ACCOUNT ---
        async deleteAccount() {
            const alert = useAlertStore()
            const auth = useAuthStore()
            const router = useRouter()

            if (!confirm('Удалить аккаунт?')) return

            this.loading = true
            this.resetErrors()

            try {
                await profileApi.delete()

                auth.user = null
                this.success = true

                await router.push('/')

            } catch (e: any) {

                if (e?.status === 422) {
                    this.errors = e.data?.errors || {}
                    return
                }

                alert.add('error', 'Ошибка удаления аккаунта')

            } finally {
                this.loading = false
            }
        }
    }
})
