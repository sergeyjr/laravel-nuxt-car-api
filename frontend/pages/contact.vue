<script setup>

import {useContactStore} from '~/stores/contact'
import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseTextarea from '~/components/BaseTextarea.vue'

const store = useContactStore()

const onSubmit = async (e) => {
    if (!e.target.checkValidity()) return
    await store.submit('contactPage')
}

</script>

<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-6">

                <h1 class="mb-4">Контактная форма</h1>

                <div v-if="store.retryAfter" class="alert alert-warning mt-4">
                    Следующее сообщение можно отправить через {{ store.retryAfter }} сек
                </div>

                <form @submit.prevent="onSubmit">

                    <BaseInput
                        v-model="store.form.name"
                        label="Имя"
                        required
                        :error="store.errors.name?.[0]"
                        autocomplete="name"
                    />

                    <BaseInput
                        v-model="store.form.email"
                        type="email"
                        label="Email"
                        required
                        :error="store.errors.email?.[0]"
                        autocomplete="email"
                    />

                    <BaseInput
                        v-model="store.form.subject"
                        label="Тема"
                        required
                        :error="store.errors.subject?.[0]"
                    />

                    <BaseTextarea
                        v-model="store.form.body"
                        label="Сообщение"
                        required
                        :error="store.errors.body?.[0]"
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
