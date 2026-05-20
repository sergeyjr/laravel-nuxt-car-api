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

const email = ref('')
const password = ref('')
const redirecting = ref(false)

/* -----------------------------
   validation
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

                <h1 class="mb-4">
                    {{ t('auth.loginTitle') }}
                </h1>

                <form @submit.prevent="submit">

                    <BaseInput
                        v-model="email"
                        type="email"
                        required
                        :disabled="authStore.loading || redirecting"
                        :error="authStore.errors.email"
                        :label="t('auth.email')"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseInput
                        v-model="password"
                        type="password"
                        required
                        :disabled="authStore.loading || redirecting"
                        :error="authStore.errors.password"
                        :label="t('auth.password')"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
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
