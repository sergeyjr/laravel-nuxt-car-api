<script setup>

import {computed} from 'vue'

import {useAuthStore} from '~/stores/auth'
import {useProfileStore} from '~/stores/profile'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

const auth = useAuthStore()
const profile = useProfileStore()

await callOnce(() => {
    if (auth.user) {
        profile.load(auth.user)
    }
})

const user = computed(() => auth.user)

const avatarUrl = computed(() => {
    if (user.value?.avatar) {
        return `/storage/${user.value.avatar}?t=${Date.now()}`
    }
    return '/images/default-avatar.png'
})

const formatDate = (date) => {
    if (!date) return ''

    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: 'Europe/Amsterdam'
    }).format(new Date(date))
}

const goBack = () => {
    if (import.meta.client && window.history.length > 1) {
        window.history.back()
    } else {
        navigateTo('/dashboard')
    }
}

</script>

<template>
    <div class="container mt-4">
        <div class="row">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Мой профиль</h2>

                <button class="btn btn-outline-secondary" @click="goBack">
                    ← Назад
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
                            alt=""/>

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
                        alt=""/>
                </div>

                <!-- DELETE ACCOUNT -->
                <BaseButton
                    variant="danger"
                    class="w-100"
                    :loading="profile.loading"
                    @click="profile.deleteAccount(auth)"
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

                        <form @submit.prevent="profile.updateProfile">

                            <BaseInput
                                v-model="profile.form.name"
                                label="Имя"
                                type="text"
                                required
                                :error="profile.errors.name?.[0]"
                            />

                            <BaseInput
                                v-model="profile.form.email"
                                label="Email"
                                type="email"
                                :disabled="true"
                                :error="profile.errors.email?.[0]"
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
                                    {{ profile.errors.avatar[0] }}
                                </small>
                            </div>

                            <div class="form-check mb-3">
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    v-model="profile.form.remove_avatar"
                                >
                                <label class="form-check-label">
                                    Удалить аватар
                                </label>
                            </div>

                            <BaseButton
                                type="submit"
                                class="w-100"
                                :loading="profile.loading"
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

                        <form @submit.prevent="profile.changePassword">

                            <div v-if="profile.passwordSuccess" class="alert alert-success mb-3">
                                Пароль обновлён
                            </div>

                            <BaseInput
                                v-model="profile.passwordForm.current_password"
                                label="Текущий пароль"
                                type="password"
                            />

                            <BaseInput
                                v-model="profile.passwordForm.password"
                                label="Новый пароль"
                                type="password"
                            />

                            <BaseInput
                                v-model="profile.passwordForm.password_confirmation"
                                label="Подтверждение"
                                type="password"
                            />

                            <BaseButton
                                type="submit"
                                variant="warning"
                                class="w-100"
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
