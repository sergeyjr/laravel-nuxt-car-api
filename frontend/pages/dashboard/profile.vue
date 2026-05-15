<script setup lang="ts">

import {ref, computed, watch} from 'vue'

import {useAuthStore} from '~/stores/auth'
import {useProfileStore} from '~/stores/profile'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'
import DeleteAccountModal from '~/components/modals/DeleteAccountModal.vue'

/* -----------------------------
   store
------------------------------*/

const auth = useAuthStore()
const profile = useProfileStore()

/* -----------------------------
   init
------------------------------*/

await callOnce(() => {
    if (auth.user) {
        profile.load(auth.user)
    }
})

/* -----------------------------
   computed
------------------------------*/

const user = computed(() => auth.user)

const avatarUrl = computed(() => {
    if (user.value?.avatar) {
        return `/storage/${user.value.avatar}`
    }
    return '/images/default-avatar.png'
})

/* -----------------------------
   state
------------------------------*/

const showDeleteModal = ref(false)

/* profile form */
const name = ref('')
const email = ref('')
const remove_avatar = ref(false)

/* password form */
const current_password = ref('')
const password = ref('')
const password_confirmation = ref('')

/* -----------------------------
   utils
------------------------------*/

const formatDate = (date: any) => {
    if (!date) return ''

    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: 'Europe/Amsterdam'
    }).format(new Date(date))
}

const goBack = () => {
    navigateTo('/dashboard')
}

/* -----------------------------
   watch
------------------------------*/

watch(
    () => auth.user,
    (user) => {
        if (!user) return

        profile.load(user)

        name.value = user.name ?? ''
        email.value = user.email ?? ''
        remove_avatar.value = false
    },
    {immediate: true}
)

/* -----------------------------
   profile validation
------------------------------*/

const validateUpdateProfile = () => {
    profile.resetErrors()

    let hasError = false

    if (!name.value) {
        profile.errors.name = 'Введите имя'
        hasError = true
    }

    return !hasError
}

/* -----------------------------
   profile submit
------------------------------*/

const submitUpdateProfile = async () => {
    if (!validateUpdateProfile()) return

    await profile.updateProfile({
        name: name.value,
        // email: email.value,
        remove_avatar: remove_avatar.value
    })
}

/* -----------------------------
   password validation
------------------------------*/

const validatePassword = () => {
    profile.resetErrors()

    let hasError = false

    if (!current_password.value) {
        profile.errors.current_password = 'Введите текущий пароль'
        hasError = true
    }

    if (!password.value) {
        profile.errors.password = 'Введите новый пароль'
        hasError = true
    }

    if (password.value && password.value.length < 6) {
        profile.errors.password = 'Минимум 6 символов'
        hasError = true
    }

    if (password.value !== password_confirmation.value) {
        profile.errors.password_confirmation = 'Пароли не совпадают'
        hasError = true
    }

    return !hasError
}

/* -----------------------------
   password submit
------------------------------*/

const submitPassword = async () => {
    if (!validatePassword()) return

    const ok = await profile.changePassword({
        current_password: current_password.value,
        password: password.value,
        password_confirmation: password_confirmation.value
    })

    if (ok) {
        current_password.value = ''
        password.value = ''
        password_confirmation.value = ''
    }
}

/* -----------------------------
   delete account
------------------------------*/

const confirmDeleteAccount = async () => {
    const ok = await profile.deleteAccount()

    if (ok) {
        showDeleteModal.value = false
    }
}

</script>

<template>
    <div class="container mt-4">
        <div class="row">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Мой профиль</h2>

                <button class="btn btn-outline-secondary" @click="goBack">
                    ← В панель управления
                </button>
            </div>

            <!-- LEFT -->
            <div class="col-md-4">

                <div class="card mb-3">
                    <div class="card-body d-flex flex-column align-items-center text-center">

                        <img
                            :src="avatarUrl"
                            class="rounded-circle mb-3 avatar"
                            width="120"
                            height="120"
                            @click="profile.openAvatar"
                            alt=""
                        />

                        <h4>{{ user?.name }}</h4>

                        <p class="text-muted">{{ user?.email }}</p>

                        <small class="text-muted">
                            Создан: {{ formatDate(user?.created_at) }}
                        </small>

                    </div>
                </div>

                <!-- MODAL -->
                <div
                    v-if="profile.showAvatarModal"
                    class="avatar-modal"
                    @click="profile.closeAvatar"
                >
                    <img
                        :src="avatarUrl"
                        class="avatar-full"
                        @click.stop
                        alt=""
                    />
                </div>

                <!-- DELETE ACCOUNT -->
                <BaseButton
                    variant="danger"
                    class="w-100"
                    :disabled="profile.loadingAll"
                    @click="showDeleteModal = true"
                >
                    Удалить аккаунт
                </BaseButton>

            </div>

            <!-- RIGHT -->
            <div class="col-md-8">

                <!-- PROFILE UPDATE -->
                <div class="card mb-3">

                    <div class="card-header">
                        Редактирование профиля
                    </div>

                    <div class="card-body">

                        <div v-if="profile.errors.general" class="alert alert-danger mb-3">
                            {{ profile.errors.general }}
                        </div>

                        <form @submit.prevent="submitUpdateProfile">

                            <BaseInput
                                v-model="name"
                                label="Имя"
                                type="text"
                                required
                                :error="profile.errors.name"
                            />

                            <BaseInput
                                v-model="email"
                                label="Email"
                                type="email"
                                disabled
                                :error="profile.errors.email"
                            />

                            <small class="text-muted d-block mt-1 mb-3">
                                Email нельзя изменить самостоятельно.
                                Для смены email отправьте запрос в поддержку:
                                <a href="mailto:admin@laravel.local">admin@laravel.local</a>
                            </small>

                            <div class="mb-3">
                                <label class="form-label">Аватар</label>
                                <input
                                    type="file"
                                    class="form-control"
                                    :class="{ 'is-invalid': profile.errors.avatar }"
                                    @change="profile.onFile"
                                >
                                <small v-if="profile.errors.avatar" class="text-danger">
                                    {{ profile.errors.avatar }}
                                </small>
                            </div>

                            <div class="form-check mb-3">
                                <input
                                    id="remove-avatar"
                                    type="checkbox"
                                    class="form-check-input"
                                    v-model="remove_avatar"
                                >

                                <label
                                    for="remove-avatar"
                                    class="form-check-label"
                                >
                                    Удалить аватар
                                </label>
                            </div>

                            <BaseButton
                                type="submit"
                                class="w-100"
                                :loading="profile.loadingProfile"
                                :disabled="profile.loadingAll"
                            >
                                <template #loading>
                                    Сохраняем...
                                </template>
                                Сохранить
                            </BaseButton>

                        </form>
                    </div>
                </div>

                <!-- PASSWORD -->
                <div class="card mb-3">
                    <div class="card-header">Смена пароля</div>

                    <div class="card-body">

                        <form @submit.prevent="submitPassword">

                            <div v-if="profile.errors.general" class="alert alert-danger mb-3">
                                {{ profile.errors.general }}
                            </div>

                            <BaseInput
                                v-model="current_password"
                                label="Текущий пароль"
                                type="password"
                                required
                                :error="profile.errors.current_password"
                            />

                            <BaseInput
                                v-model="password"
                                label="Новый пароль"
                                type="password"
                                required
                                :error="profile.errors.password"
                            />

                            <BaseInput
                                v-model="password_confirmation"
                                label="Подтверждение"
                                type="password"
                                required
                                :error="profile.errors.password_confirmation"
                            />

                            <BaseButton
                                type="submit"
                                variant="warning"
                                class="w-100"
                                :loading="profile.loadingPassword"
                                :disabled="profile.loadingAll"
                            >
                                <template #loading>
                                    Обновляем...
                                </template>
                                Обновить пароль
                            </BaseButton>

                        </form>

                    </div>
                </div>

            </div>

        </div>
    </div>

    <!-- DELETE ACCOUNT MODAL -->
    <div
        class="modal fade show d-block"
        tabindex="-1"
        v-if="showDeleteModal"
        style="background: rgba(0,0,0,.6)"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title text-danger">
                        Удаление аккаунта
                    </h5>

                    <button
                        type="button"
                        class="btn-close"
                        @click="showDeleteModal = false"
                    ></button>
                </div>

                <div class="modal-body">
                    <p class="mb-0">
                        Вы уверены, что хотите удалить аккаунт?
                        <br>
                        Это действие <strong>нельзя отменить</strong>.
                    </p>
                </div>

                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        @click="showDeleteModal = false"
                    >
                        Отмена
                    </button>

                    <button
                        class="btn btn-danger"
                        :disabled="profile.loadingDelete"
                        @click="confirmDeleteAccount"
                    >
                        <span v-if="profile.loadingDelete">
                            Удаляем...
                        </span>
                        <span v-else>
                            Да, удалить
                        </span>
                    </button>

                </div>

            </div>
        </div>
    </div>

    <DeleteAccountModal
        :show="showDeleteModal"
        :loading="profile.loadingDelete"
        @close="showDeleteModal = false"
        @confirm="confirmDeleteAccount"
    />

</template>

<style scoped>

.card img.avatar {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card img.avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.avatar-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.avatar-full {
    max-width: 80vw;
    max-height: 80vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

</style>
