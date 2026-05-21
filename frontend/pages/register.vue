<script setup lang="ts">

import {onMounted, ref} from 'vue'

import {useI18n} from 'vue-i18n'

import {useAuthStore} from '~/stores/auth'

import {useFormValidation} from '~/composables/useFormValidation'

import BaseButton from '~/components/ui/base/BaseButton.vue'
import BaseInput from '~/components/ui/base/BaseInput.vue'

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
   state
------------------------------*/

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

/* -----------------------------
   validation
------------------------------*/

const {
    setNativeValidity,
    clearNativeValidity,
} = useFormValidation()

/* -----------------------------
   helpers
------------------------------*/

const isDisabled = () =>
    authStore.loading

const resetForm = () => {
    name.value = ''
    email.value = ''
    password.value = ''
    passwordConfirmation.value = ''
}

/* -----------------------------
   submit
------------------------------*/

const submit = async (event: Event) => {
    const form = event.currentTarget as HTMLFormElement

    if (!form.reportValidity()) {
        return
    }

    if (isDisabled()) {
        return
    }

    const success = await authStore.register({
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: passwordConfirmation.value,
    })

    if (!success) {
        return
    }

    resetForm()
}

/* -----------------------------
   lifecycle
------------------------------*/

onMounted(() => {
    authStore.resetErrors()
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
                        :disabled="isDisabled()"
                        :error="authStore.errors.name"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseInput
                        v-model="email"
                        type="email"
                        :label="t('auth.email')"
                        required
                        :disabled="isDisabled()"
                        :error="authStore.errors.email"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseInput
                        v-model="password"
                        type="password"
                        :label="t('auth.password')"
                        required
                        :disabled="isDisabled()"
                        :error="authStore.errors.password"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseInput
                        v-model="passwordConfirmation"
                        type="password"
                        :label="t('auth.passwordConfirm')"
                        required
                        :disabled="isDisabled()"
                        :error="authStore.errors.password_confirmation"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseButton
                        type="submit"
                        class="w-100 mt-3"
                        :loading="isDisabled()"
                        :disabled="isDisabled()"
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
