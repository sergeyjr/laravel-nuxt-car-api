<script setup>

import {ref} from 'vue'
import {useAuthStore} from '~/stores/auth'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

const store = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')

const validate = () => {
    store.clearErrors()

    let hasError = false

    if (!name.value) {
        store.errors.name = 'Имя обязательно'
        hasError = true
    }

    if (!email.value) {
        store.errors.email = 'Email обязателен'
        hasError = true
    }

    if (!password.value) {
        store.errors.password = 'Пароль обязателен'
        hasError = true
    }

    if (password.value && password.value.length < 6) {
        store.errors.password = 'Минимум 6 символов'
        hasError = true
    }

    if (password.value !== password_confirmation.value) {
        store.errors.password_confirmation = 'Пароли не совпадают'
        hasError = true
    }

    return !hasError
}

const submit = async () => {
    if (!validate()) return

    const ok = await store.register({
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: password_confirmation.value
    })

    if (ok) {
        name.value = ''
        email.value = ''
        password.value = ''
        password_confirmation.value = ''
    }
}

</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-5">

                <h1 class="mb-4">Регистрация</h1>

                <p v-if="store.success" class="text-success text-center">
                    {{ store.success }}
                </p>

                <p v-if="store.error" class="text-danger text-center">
                    {{ store.error }}
                </p>

                <form @submit.prevent="submit">

                    <BaseInput
                        v-model="name"
                        label="Имя"
                        :error="store.errors.name"
                    />

                    <BaseInput
                        v-model="email"
                        type="email"
                        label="Email"
                        :error="store.errors.email"
                    />

                    <BaseInput
                        v-model="password"
                        type="password"
                        label="Пароль"
                        :error="store.errors.password"
                    />

                    <BaseInput
                        v-model="password_confirmation"
                        type="password"
                        label="Повтор пароля"
                        :error="store.errors.password_confirmation"
                    />

                    <BaseButton
                        type="submit"
                        class="w-100 mt-3"
                        :loading="store.loading"
                    >
                        <template #loading>
                            Регистрация...
                        </template>
                        Зарегистрироваться
                    </BaseButton>

                    <p class="text-center mt-3">
                        <NuxtLink to="/login">
                            Войти
                        </NuxtLink>
                    </p>

                </form>

            </div>
        </div>
    </div>
</template>
