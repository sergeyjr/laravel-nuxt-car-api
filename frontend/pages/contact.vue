<script setup lang="ts">
import { useContactStore } from '~/stores/contact'
import BaseButton from '~/components/BaseButton.vue'

const store = useContactStore()

// чтобы не писать длинные цепочки в шаблоне
const form = store.form
const errors = store.errors
const contexts = store.contexts
</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-6">

                <h1 class="mb-4">Контактная форма</h1>

                <!-- SUCCESS -->
                <div
                    v-if="contexts.contactPage.successMessage"
                    class="alert alert-success"
                >
                    {{ contexts.contactPage.successMessage }}
                </div>

                <!-- ERROR -->
                <div
                    v-if="contexts.contactPage.errorMessage"
                    class="alert alert-danger"
                >
                    {{ contexts.contactPage.errorMessage }}
                </div>

                <!-- RATE LIMIT -->
                <div v-if="store.retryAfter" class="alert alert-warning mt-4">
                    Подождите {{ store.retryAfter }} сек перед повторной отправкой
                </div>

                <form @submit.prevent="store.submit('contactPage')">

                    <!-- NAME -->
                    <div class="mb-3">
                        <label class="form-label" for="contact-name">
                            Имя <span class="text-danger">*</span>
                        </label>

                        <input
                            id="contact-name"
                            v-model="form.name"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': errors.name }"
                            required
                            autocomplete="name"
                        >

                        <small v-if="errors.name" class="text-danger">
                            {{ errors.name }}
                        </small>
                    </div>

                    <!-- EMAIL -->
                    <div class="mb-3">
                        <label class="form-label" for="contact-email">
                            Email <span class="text-danger">*</span>
                        </label>

                        <input
                            id="contact-email"
                            v-model="form.email"
                            type="email"
                            class="form-control"
                            :class="{ 'is-invalid': errors.email }"
                            required
                            autocomplete="email"
                        >

                        <small v-if="errors.email" class="text-danger">
                            {{ errors.email }}
                        </small>
                    </div>

                    <!-- SUBJECT -->
                    <div class="mb-3">
                        <label class="form-label" for="contact-subject">
                            Тема сообщения <span class="text-danger">*</span>
                        </label>

                        <input
                            id="contact-subject"
                            v-model="form.subject"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': errors.subject }"
                            required
                        >

                        <small v-if="errors.subject" class="text-danger">
                            {{ errors.subject }}
                        </small>
                    </div>

                    <!-- BODY -->
                    <div class="mb-3">
                        <label class="form-label" for="contact-body">
                            Текст сообщения <span class="text-danger">*</span>
                        </label>

                        <textarea
                            id="contact-body"
                            v-model="form.body"
                            class="form-control"
                            :class="{ 'is-invalid': errors.body }"
                            rows="5"
                            required
                        />

                        <small v-if="errors.body" class="text-danger">
                            {{ errors.body }}
                        </small>
                    </div>

                    <!-- SUBMIT -->
                    <BaseButton
                        variant="primary"
                        type="submit"
                        class="w-100"
                        :loading="store.loading"
                        :disabled="store.retryAfter > 0"
                    >
                        <template #loading>
                            Отправляем...
                        </template>

                        Отправить сообщение
                    </BaseButton>

                </form>

            </div>
        </div>
    </div>
</template>
