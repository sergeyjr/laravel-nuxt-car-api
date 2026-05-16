<script setup lang="ts">

import {ref, onMounted} from 'vue'

import {useAuthStore} from '~/stores/auth'
import {navigateTo} from '#app'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

/* -----------------------------
   store
------------------------------*/

const authStore = useAuthStore()

/* -----------------------------
   form state
------------------------------*/

const email = ref('')
const password = ref('')

/* -----------------------------
   validation
------------------------------*/

const validate = () => {
    const errors: Record<string, string> = {}

    if (!email.value) {
        errors.email = 'Email обязателен'
    }

    if (!password.value) {
        errors.password = 'Пароль обязателен'
    }

    authStore.errors = {...errors}

    return Object.keys(errors).length === 0
}

/* -----------------------------
   submit
------------------------------*/

const submit = async () => {
    if (!validate()) return

    const ok = await authStore.login(email.value, password.value)

    if (ok) {
        return navigateTo('/dashboard')
    }
}

/* -----------------------------
   lifecycle
------------------------------*/

onMounted(() => {
    authStore.clearErrors()
})

</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-5">

                <h1 class="mb-4">Авторизация</h1>

                <p v-if="authStore.success" class="text-success text-center">
                    {{ authStore.success }}
                </p>

                <form @submit.prevent="submit">

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

                    <BaseButton
                        type="submit"
                        class="w-100 mt-3"
                        :loading="authStore.loading"
                    >
                        <template #loading>
                            Входим...
                        </template>
                        Войти
                    </BaseButton>

                    <p class="text-center mt-3">
                        <NuxtLink to="/register">
                            Зарегистрироваться
                        </NuxtLink>
                    </p>

                </form>

            </div>
        </div>
    </div>
</template>
