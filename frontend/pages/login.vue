<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '#app'
import { useAuthStore } from '~/stores/auth'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

const router = useRouter()
const store = useAuthStore()

const email = ref('')
const password = ref('')

// =========================
// RESET ERRORS
// =========================
onMounted(() => {
    store.resetMessages?.()
    store.errors = {}
})

// =========================
// SIMPLE VALIDATION
// =========================
const submit = async () => {
    store.errors = {}
    store.error = null
    store.success = null

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
        await router.push('/dashboard')
    }
}
</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-5">

                <h1 class="mb-4">Авторизация</h1>

                <!-- SUCCESS -->
                <p v-if="store.success" class="text-success text-center">
                    {{ store.success }}
                </p>

                <!-- ERROR -->
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
                        variant="primary"
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
