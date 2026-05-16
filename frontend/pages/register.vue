<script setup lang="ts">

import { ref, onMounted } from 'vue'

import { useAuthStore } from '~/stores/auth'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

const { t } = useI18n()

const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')

const validate = () => {
    const errors: Record<string, string> = {}

    if (!name.value) {
        errors.name = t('auth.nameRequired')
    }

    if (!email.value) {
        errors.email = t('auth.emailRequired')
    }

    if (!password.value) {
        errors.password = t('auth.passwordRequired')
    }

    if (password.value && password.value.length < 6) {
        errors.password = t('auth.passwordMin')
    }

    if (password.value !== password_confirmation.value) {
        errors.password_confirmation = t('auth.passwordMismatch')
    }

    authStore.errors = { ...errors }

    return Object.keys(errors).length === 0
}

const submit = async () => {
    if (!validate()) return

    const ok = await authStore.register({
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

onMounted(() => {
    authStore.clearErrors()
})

</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-5">

                <h1 class="mb-4">{{ t('auth.registerTitle') }}</h1>

                <form @submit.prevent="submit">

                    <BaseInput
                        v-model="name"
                        type="text"
                        :label="t('auth.name')"
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
                        :label="t('auth.password')"
                        required
                        :disabled="authStore.loading"
                        :error="authStore.errors.password"
                    />

                    <BaseInput
                        v-model="password_confirmation"
                        type="password"
                        :label="t('auth.passwordConfirm')"
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
                            {{ t('auth.registering') }}
                        </template>
                        {{ t('auth.register') }}
                    </BaseButton>

                    <p class="text-center mt-3">
                        <NuxtLink to="/login">
                            {{ t('auth.loginLink') }}
                        </NuxtLink>
                    </p>

                </form>

            </div>
        </div>
    </div>
</template>
