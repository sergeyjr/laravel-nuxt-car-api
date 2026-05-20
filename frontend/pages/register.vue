<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'

import {useAuthStore} from '~/stores/auth'

import BaseButton from '~/components/ui/base/BaseButton.vue'
import BaseInput from '~/components/ui/base/BaseInput.vue'
import {useFormValidation} from '~/composables/useFormValidation'

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

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const redirecting = ref(false)

/* -----------------------------
   validation composable
------------------------------*/

const {
    setNativeValidity,
    clearNativeValidity,
} = useFormValidation()

/* -----------------------------
   submit
------------------------------*/

const submit = async (e: Event) => {
    const form = e.currentTarget as HTMLFormElement

    if (!form.reportValidity()) return
    if (authStore.loading || redirecting.value) return

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
        redirecting.value = true

        // если нужно:
        // return navigateTo(localePath('/dashboard'))
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

                <h1 class="mb-4">
                    {{ t('auth.registerTitle') }}
                </h1>

                <form @submit.prevent="submit">

                    <BaseInput
                        v-model="name"
                        type="text"
                        :label="t('auth.name')"
                        required
                        :disabled="authStore.loading || redirecting"
                        :error="authStore.errors.name"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseInput
                        v-model="email"
                        type="email"
                        :label="t('auth.email')"
                        required
                        :disabled="authStore.loading || redirecting"
                        :error="authStore.errors.email"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseInput
                        v-model="password"
                        type="password"
                        :label="t('auth.password')"
                        required
                        :disabled="authStore.loading || redirecting"
                        :error="authStore.errors.password"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseInput
                        v-model="password_confirmation"
                        type="password"
                        :label="t('auth.passwordConfirm')"
                        required
                        :disabled="authStore.loading || redirecting"
                        :error="authStore.errors.password_confirmation"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseButton
                        type="submit"
                        class="w-100 mt-3"
                        :loading="authStore.loading || redirecting"
                    >
                        <template #loading>
                            {{ t('auth.registering') }}
                        </template>
                        {{ t('auth.register') }}
                    </BaseButton>

                    <p class="text-center mt-3">
                        <NuxtLink :to="localePath('/login')">
                            {{ t('auth.loginLink') }}
                        </NuxtLink>
                    </p>

                </form>

            </div>
        </div>
    </div>
</template>
