<script setup lang="ts">

import {useContactStore} from '~/stores/contact'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseTextarea from '~/components/BaseTextarea.vue'

/* -----------------------------
   store
------------------------------*/

const store = useContactStore()

/* -----------------------------
   submit
------------------------------*/

const onSubmit = async (e: Event) => {
    const form = e.target as HTMLFormElement
    if (!form.checkValidity()) return
    await store.submit('contactPage')
}

</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-6">

                <h1 class="mb-4">Контактная форма</h1>

                <!-- rate limit warning -->
                <div v-if="store.retryAfter > 0" class="alert alert-warning mt-4">
                    Следующее сообщение можно отправить через {{ store.retryAfter }} сек.
                </div>

                <form @submit.prevent="onSubmit">

                    <BaseInput
                        v-model="store.form.name"
                        label="Имя"
                        required
                        :disabled="store.retryAfter > 0"
                        :error="store.errors.name"
                    />

                    <BaseInput
                        v-model="store.form.email"
                        type="email"
                        label="Email"
                        required
                        :disabled="store.retryAfter > 0"
                        :error="store.errors.email"
                    />

                    <BaseInput
                        v-model="store.form.subject"
                        label="Тема"
                        required
                        :disabled="store.retryAfter > 0"
                        :error="store.errors.subject"
                    />

                    <BaseTextarea
                        v-model="store.form.body"
                        label="Сообщение"
                        required
                        :disabled="store.retryAfter > 0"
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
