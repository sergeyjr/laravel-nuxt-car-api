<script setup>

import {useContactStore} from '~/stores/contact'
import BaseButton from '~/components/BaseButton.vue'

const store = useContactStore()

</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-6">

                <h1 class="mb-4">Контактная форма</h1>

                <div v-if="store.contexts.contactPage.successMessage" class="alert alert-success">
                    {{ store.contexts.contactPage.successMessage }}
                </div>

                <div v-if="store.contexts.contactPage.errorMessage" class="alert alert-danger">
                    {{ store.contexts.contactPage.errorMessage }}
                </div>

                <div v-if="store.retryAfter" class="alert alert-warning mt-4">
                    Подождите {{ store.retryAfter }} сек перед повторной отправкой
                </div>

                <form @submit.prevent="store.submit">

                    <div class="mb-3">
                        <label class="form-label">Имя *</label>
                        <input
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': store.errors.name }"
                            v-model="store.form.name"
                            required
                            autocomplete="name"
                        >
                        <small v-if="store.errors.name" class="text-danger">
                            {{ store.errors.name }}
                        </small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Email *</label>
                        <input
                            type="email"
                            class="form-control"
                            :class="{ 'is-invalid': store.errors.email }"
                            v-model="store.form.email"
                            required
                            autocomplete="email"
                        >
                        <small v-if="store.errors.email" class="text-danger">
                            {{ store.errors.email }}
                        </small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Тема *</label>
                        <input
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': store.errors.subject }"
                            v-model="store.form.subject"
                            required
                        >
                        <small v-if="store.errors.subject" class="text-danger">
                            {{ store.errors.subject }}
                        </small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Сообщение *</label>
                        <textarea
                            class="form-control"
                            rows="5"
                            :class="{ 'is-invalid': store.errors.body }"
                            v-model="store.form.body"
                            required
                        ></textarea>
                        <small v-if="store.errors.body" class="text-danger">
                            {{ store.errors.body }}
                        </small>
                    </div>

                    <BaseButton
                        type="submit"
                        class="w-100"
                        :loading="store.loading"
                        :disabled="store.retryAfter > 0"
                    >
                        <template #loading>Отправляем...</template>
                        Отправить сообщение
                    </BaseButton>

                </form>

            </div>
        </div>
    </div>
</template>
