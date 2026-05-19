<script setup lang="ts">

console.log('[Login Vue]');

import {ref, onMounted} from 'vue'

import {useI18n} from 'vue-i18n'

import {useAuthStore} from '~/stores/auth'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

/* -----------------------------
   store
------------------------------*/

const authStore = useAuthStore()

/* -----------------------------
   form state
------------------------------*/

const email = ref('')
const password = ref('')
const redirecting = ref(false)

/* -----------------------------
   validation
------------------------------*/

const validate = () => {
    const errors: Record<string, string> = {}
    if (!email.value) {
        errors.email = t('auth.emailRequired')
    }
    if (!password.value) {
        errors.password = t('auth.passwordRequired')
    }
    authStore.errors = {...errors}
    return Object.keys(errors).length === 0
}

/* -----------------------------
   submit
------------------------------*/

const submit = async () => {
    if (authStore.loading || redirecting.value) return
    if (!validate()) return
    const ok = await authStore.login(email.value, password.value)
    if (ok) {
        redirecting.value = true
        return navigateTo(localePath('/dashboard'))
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

                <h1 class="mb-4">{{ t('auth.loginTitle') }}</h1>

                <form @submit.prevent="submit">

                    <BaseInput
                        v-model="email"
                        type="email"
                        required
                        :disabled="authStore.loading || redirecting"
                        :error="authStore.errors.email"
                        :label="t('auth.email')"
                    />

                    <BaseInput
                        v-model="password"
                        type="password"
                        :disabled="authStore.loading || redirecting"
                        :error="authStore.errors.password"
                        :label="t('auth.password')"
                    />

                    <BaseButton
                        type="submit"
                        class="w-100 mt-3"
                        :loading="authStore.loading || redirecting"
                    >
                        <template #loading>
                            {{ t('auth.loggingIn') }}
                        </template>
                        {{ t('auth.login') }}
                    </BaseButton>

                    <p class="text-center mt-3">
                        <NuxtLink :to="localePath('/register')">
                            {{ t('auth.registerLink') }}
                        </NuxtLink>
                    </p>

                </form>

            </div>
        </div>
    </div>
</template>
