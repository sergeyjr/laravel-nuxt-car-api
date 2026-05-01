<script setup>

import {ref, onMounted} from 'vue'
import {useAuthStore} from '~/stores/auth'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

const store = useAuthStore()

const email = ref('')
const password = ref('')

const submit = async () => {
    store.errors = {}

    let hasError = false

    if (!email.value) {
        store.errors.email = 'Email обязателен'
        hasError = true
    }

    if (!password.value) {
        store.errors.password = 'Пароль обязателен'
        hasError = true
    }

    if (hasError) return

    const ok = await store.login(email.value, password.value)

    if (ok) {
        return navigateTo('/')
    }
}

onMounted(() => {
    store.clearErrors()
})

</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-5">

                <h1 class="mb-4">Авторизация</h1>

                <p v-if="store.success" class="text-success text-center">
                    {{ store.success }}
                </p>

                <p v-if="store.error" class="text-danger text-center">
                    {{ store.error }}
                </p>

                <form @submit.prevent="submit">

                    <BaseInput
                        v-model="email"
                        type="email"
                        label="Email"
                        required
                        :error="store.errors.email"
                    />

                    <BaseInput
                        v-model="password"
                        type="password"
                        label="Пароль"
                        required
                        :error="store.errors.password"
                    />

                    <BaseButton
                        type="submit"
                        class="w-100 mt-3"
                        :loading="store.loading"
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
