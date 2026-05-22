<script setup lang="ts">

import {computed, onMounted, ref} from 'vue'

import {useContactStore} from '~/stores/contact'
import type {ContactPerson} from '~/types/contacts'

import BaseButton from '~/components/ui/base/BaseButton.vue'
import BaseInput from '~/components/ui/base/BaseInput.vue'
import BaseTextarea from '~/components/ui/base/BaseTextarea.vue'

import {formatPhoneRU, formatPhoneRaw} from '~/utils/formatters'

import {useI18n} from 'vue-i18n'

import {useFormValidation} from '~/composables/useFormValidation'

/* -----------------------------
   i18n
------------------------------*/

const {t, tm} = useI18n()

/* -----------------------------
   stores
------------------------------*/

const contactStore = useContactStore()

/* -----------------------------
   validation
------------------------------*/

const {setNativeValidity, clearNativeValidity} = useFormValidation()

/* -----------------------------
   hydration
------------------------------*/

const hydrated = ref(false)

/* -----------------------------
   retry state
------------------------------*/

if (import.meta.server) {
    contactStore.restoreRetryState()
}

onMounted(() => {
    hydrated.value = true

    if (contactStore.retryUntil > 0) {
        contactStore.startCountdown()
        return
    }

    contactStore.restoreRetryState()
})

const isFormDisabled = computed(() => {
    return contactStore.loading || contactStore.retryAfter > 0
})

/* -----------------------------
   locales
------------------------------*/

const contacts = computed(() => {
    const people = tm('contacts.people') as Record<string, ContactPerson>

    return Object.entries(people).map(([key, person]) => ({
        key,
        ...person,
    }))
})

const email = (key: string) => {
    const user = t(`contacts.people.${key}.email.user`)
    const domain = t(`contacts.people.${key}.email.domain`)

    return `${user}@${domain}`
}

const mailto = (key: string) => {
    return `mailto:${email(key)}`
}

/* -----------------------------
   actions
------------------------------*/

const onSubmit = async (e: Event) => {
    const form = e.currentTarget as HTMLFormElement

    if (!form.reportValidity()) {
        return
    }

    await contactStore.submit('contactPage')
}

</script>

<template>
    <div class="container mt-4">
        <div class="row g-4">

            <div class="col-12 col-md-6">

                <h1 class="mb-4">
                    {{ t('contact.title') }}
                </h1>

                <div
                    v-for="c in contacts"
                    :key="c.key"
                    class="contact-item mb-4 p-3 border rounded"
                >
                    <div class="fw-semibold mb-2">
                        {{ t(`contacts.people.${c.key}.name`) }}
                    </div>

                    <div class="text-muted small mb-2">
                        {{ t(`contacts.people.${c.key}.role`) }}
                    </div>

                    <div class="mb-1">
                        <i class="bi bi-telephone me-1"></i>
                        <a :href="`tel:+${formatPhoneRaw(t(`contacts.people.${c.key}.phone`))}`">
                            {{ formatPhoneRU(t(`contacts.people.${c.key}.phone`)) }}
                        </a>
                    </div>

                    <div class="mb-1 text-muted small">
                        <i class="bi bi-envelope me-1"></i>
                        <a :href="mailto(c.key)">
                            {{ email(c.key) }}
                        </a>
                    </div>

                    <div class="text-muted small">
                        <i class="bi bi-geo-alt me-1"></i>
                        {{ t(`contacts.people.${c.key}.address`) }}
                    </div>
                </div>

            </div>

            <div class="col-12 col-md-6">

                <h1 class="mb-4">
                    {{ t('contact.formTitle') }}
                </h1>

                <div
                    v-if="contactStore.retryAfter > 0"
                    class="alert alert-warning mt-4"
                >
                    {{ t('contact.retry', {sec: contactStore.retryAfter}) }}
                </div>

                <form @submit.prevent="onSubmit">

                    <BaseInput
                        v-model="contactStore.form.name"
                        :label="t('contact.name')"
                        required
                        :disabled="isFormDisabled"
                        :error="contactStore.errors.name"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseInput
                        v-model="contactStore.form.email"
                        type="email"
                        :label="t('contact.email')"
                        required
                        :disabled="isFormDisabled"
                        :error="contactStore.errors.email"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseInput
                        v-model="contactStore.form.subject"
                        :label="t('contact.subject')"
                        required
                        :disabled="isFormDisabled"
                        :error="contactStore.errors.subject"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseTextarea
                        v-model="contactStore.form.body"
                        :label="t('contact.message')"
                        required
                        :disabled="isFormDisabled"
                        :error="contactStore.errors.body"
                        @invalid="setNativeValidity"
                        @input="clearNativeValidity"
                    />

                    <BaseButton
                        type="submit"
                        class="w-100"
                        :loading="contactStore.loading"
                        :disabled="isFormDisabled"
                    >
                        <template #loading>
                            {{ t('contact.sending') }}
                        </template>
                        {{ t('contact.send') }}
                    </BaseButton>

                </form>

            </div>

        </div>
    </div>
</template>
