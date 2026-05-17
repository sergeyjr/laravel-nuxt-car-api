<script setup lang="ts">

import {useContactStore} from '~/stores/contact'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseTextarea from '~/components/BaseTextarea.vue'

import {formatPhoneRU} from '~/utils/formatters'
import {useI18n} from "vue-i18n";

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

/* -----------------------------
   stores
------------------------------*/

const contactStore = useContactStore()

const onSubmit = async (e: Event) => {
    const form = e.target as HTMLFormElement
    if (!form.checkValidity()) return
    await contactStore.submit('contactPage')
}

/* -----------------------------
   fake contacts (UI only)
------------------------------*/

const contacts = [
    {
        name: 'Алексей Смирнов',
        role: 'Главный по кнопке “починить всё”',
        phone: '+7 XXX 123 45 67',
        email: 'support@laravel.local',
        address: 'г. Москва, ул. Багфиксная, д. 404, офис “Segfault”'
    },
    {
        name: 'Мария Кузнецова',
        role: 'Отдел продаж (продаёт даже баги)',
        phone: '8XXX1239876',
        email: 'sales@laravel.local',
        address: 'г. Санкт-Петербург, пр. Продажный, д. 12, этаж 3 (рядом с кофе-машиной)'
    },
    {
        name: 'Иван Петров',
        role: 'Общие вопросы и философия backend-а',
        phone: '7 XXX 555 44 33',
        email: 'info@laravel.local',
        address: 'г. Казань, ул. Рефакторинга, д. 0, корпус “Legacy”'
    }
]

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

                    <div class="fw-semibold">
                        <i class="bi bi-person me-1"></i>
                        {{ c.name }}
                    </div>

                    <div class="text-muted small mb-2">
                        <i class="bi bi-briefcase me-1"></i>
                        {{ c.role }}
                    </div>

                    <div class="mb-1">
                        <i class="bi bi-telephone me-1"></i>
                        {{ formatPhoneRU(c.phone) }}
                    </div>

                    <div class="mb-1 text-muted small">
                        <i class="bi bi-envelope me-1"></i>
                        {{ c.email }}
                    </div>

                    <div class="text-muted small">
                        <i class="bi bi-geo-alt me-1"></i>
                        {{ c.address }}
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
