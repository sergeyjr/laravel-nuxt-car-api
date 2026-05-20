<script setup lang="ts">

import { useContactStore } from '~/stores/contact'
import type { ContactPerson } from '~/types/contacts'

import BaseButton from '~/components/ui/base/BaseButton.vue'
import BaseInput from '~/components/ui/base/BaseInput.vue'
import BaseTextarea from '~/components/ui/base/BaseTextarea.vue'

import {formatPhoneRU, formatPhoneRaw} from '~/utils/formatters'

import {useI18n} from "vue-i18n";

/* -----------------------------
   i18n
------------------------------*/

const {t, tm } = useI18n()

/* -----------------------------
   stores
------------------------------*/

const contactStore = useContactStore()

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
    const form = e.target as HTMLFormElement
    if (!form.checkValidity()) return
    await contactStore.submit('contactPage')
}

</script>

<template>
    <div class="container mt-4">
        <div class="row g-4">

            <div class="col-12 col-md-6">

                <h1 class="mb-4">{{ t('contact.title') }}</h1>

                <div
                    v-for="c in contacts"
                    :key="c.email"
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

                <h1 class="mb-4">{{ t('contact.formTitle') }}</h1>

                <div v-if="contactStore.retryAfter > 0" class="alert alert-warning mt-4">
                    {{ t('contact.retry', {sec: contactStore.retryAfter}) }}
                </div>

                <form @submit.prevent="onSubmit">

                    <BaseInput
                        v-model="contactStore.form.name"
                        :label="t('contact.name')"
                        required
                        :disabled="contactStore.retryAfter > 0"
                        :error="contactStore.errors.name"
                    />

                    <BaseInput
                        v-model="contactStore.form.email"
                        type="email"
                        label="Email"
                        required
                        :disabled="contactStore.retryAfter > 0"
                        :error="contactStore.errors.email"
                    />

                    <BaseInput
                        v-model="contactStore.form.subject"
                        :label="t('contact.subject')"
                        required
                        :disabled="contactStore.retryAfter > 0"
                        :error="contactStore.errors.subject"
                    />

                    <BaseTextarea
                        v-model="contactStore.form.body"
                        :label="t('contact.message')"
                        required
                        :disabled="contactStore.retryAfter > 0"
                        :error="contactStore.errors.body"
                    />

                    <BaseButton
                        type="submit"
                        class="w-100"
                        :loading="contactStore.loading"
                        :disabled="contactStore.retryAfter > 0"
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
