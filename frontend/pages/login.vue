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
   helpers
------------------------------*/

const isDisabled = () =>
    authStore.loading || redirecting.value

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

    const success = await authStore.login(
        email.value,
        password.value,
    )

    if (!success) {
        return
    }

    redirecting.value = true

    return navigateTo(
        localePath('/dashboard'),
    )
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
                    {{ t('auth.loginTitle') }}
                </h1>

                <form @submit.prevent="submit">

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

                    <BaseButton
                        type="submit"
                        class="w-100 mt-3"
                        :loading="isDisabled()"
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
