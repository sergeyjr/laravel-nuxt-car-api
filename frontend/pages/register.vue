<script setup lang="ts">

import {ref, onMounted} from 'vue'

import {useAuthStore} from '~/stores/auth'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

/* -----------------------------
   store
------------------------------*/

const authStore = useAuthStore()

/* -----------------------------
   form state
------------------------------*/

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')

/* -----------------------------
   validation
------------------------------*/

const validate = () => {
    const errors: Record<string, string> = {}

    if (!name.value) {
        errors.name = 'Имя обязательно'
    }

    if (!email.value) {
        errors.email = 'Email обязателен'
    }

    if (!password.value) {
        errors.password = 'Пароль обязателен'
    }

    if (password.value && password.value.length < 6) {
        errors.password = 'Минимум 6 символов'
    }

    if (password.value !== password_confirmation.value) {
        errors.password_confirmation = 'Пароли не совпадают'
    }

    store.errors = {...errors}

    return Object.keys(errors).length === 0
}

/* -----------------------------
   submit
------------------------------*/

const submit = async () => {
    if (!validate()) return

    const ok = await store.register({
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: password_confirmation.value
    })

    if (ok) {
        // reset form
        name.value = ''
        email.value = ''
        password.value = ''
        password_confirmation.value = ''
    }
}

/* -----------------------------
   lifecycle
------------------------------*/

onMounted(() => {
    store.clearErrors()
})

</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-5">

                <h1 class="mb-4">Регистрация</h1>

                <form @submit.prevent="submit">

                    <BaseInput
                        v-model="name"
                        type="text"
                        label="Имя"
                        required
                        :disabled="authStore.loading"
                        :error="authStore.errors.name"
                    />

                    <BaseInput
                        v-model="email"
                        type="email"
                        label="Email"
                        required
                        :disabled="authStore.loading"
                        :error="authStore.errors.email"
                    />

                    <BaseInput
                        v-model="password"
                        type="password"
                        label="Пароль"
                        required
                        :disabled="authStore.loading"
                        :error="authStore.errors.password"
                    />

                    <BaseInput
                        v-model="password_confirmation"
                        type="password"
                        label="Повтор пароля"
                        required
                        :disabled="authStore.loading"
                        :error="authStore.errors.password_confirmation"
                    />

                    <BaseButton
                        type="submit"
                        class="w-100 mt-3"
                        :loading="authStore.loading"
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
