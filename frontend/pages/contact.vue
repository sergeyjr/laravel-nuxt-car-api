<script setup>

import { useContactStore } from '~/stores/contact'
import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

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

                    <BaseInput
                        v-model="store.form.name"
                        label="Имя"
                        required
                        :error="store.errors.name"
                        autocomplete="name"
                    />

                    <BaseInput
                        v-model="store.form.email"
                        type="email"
                        label="Email"
                        required
                        :error="store.errors.email"
                        autocomplete="email"
                    />

                    <BaseInput
                        v-model="store.form.subject"
                        label="Тема"
                        required
                        :error="store.errors.subject"
                    />

                    <BaseInput
                        v-model="store.form.body"
                        type="textarea"
                        label="Сообщение"
                        required
                        :error="store.errors.body"
                    />

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
