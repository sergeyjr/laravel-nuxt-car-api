<script setup lang="ts">

import {useContactStore} from '~/stores/contact'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseTextarea from '~/components/BaseTextarea.vue'

/* -----------------------------
   store
------------------------------*/

const contactStore = useContactStore()

/* -----------------------------
   submit
------------------------------*/

const onSubmit = async (e: Event) => {
    const form = e.target as HTMLFormElement
    if (!form.checkValidity()) return
    await contactStore.submit('contactPage')
}

</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-6">

                <h1 class="mb-4">Контактная форма</h1>

                <div v-if="contactStore.retryAfter > 0" class="alert alert-warning mt-4">
                    Следующее сообщение можно отправить через {{ contactStore.retryAfter }} сек.
                </div>

                <form @submit.prevent="onSubmit">

                    <BaseInput
                        v-model="contactStore.form.name"
                        label="Имя"
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
                        label="Тема"
                        required
                        :disabled="contactStore.retryAfter > 0"
                        :error="contactStore.errors.subject"
                    />

                    <BaseTextarea
                        v-model="contactStore.form.body"
                        label="Сообщение"
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
                            Отправляем...
                        </template>
                        Отправить сообщение
                    </BaseButton>

                </form>

            </div>
        </div>
    </div>
</template>
