<script setup lang="ts">

import {useCarStore} from '~/stores/car'

import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'

/* -----------------------------
   store
------------------------------*/

const store = useCarStore()
const router = useRouter()

/* -----------------------------
   init
------------------------------*/

store.reset()

/* -----------------------------
   actions
------------------------------*/

const submit = async () => {
    try {
        const result = await store.submit()

        if (result?.id) {
            await navigateTo(`/cars/show/${result.id}`)
        }
    } catch (e) {
        console.error(e)
    }
}

const generate = async () => {
    try {
        await store.generate()
    } catch (e) {
        console.error(e)
    }
}

</script>

<template>
    <div class="container mt-4">

        <h1 class="mb-4">Создание автомобиля</h1>

        <form @submit.prevent="submit">

            <div class="row">

                <div class="col-6">

                    <BaseInput
                        v-model="store.form.title"
                        label="Заголовок"
                        :error="store.errors.title"
                    />

                    <BaseInput
                        v-model="store.form.description"
                        label="Описание"
                        :error="store.errors.description"
                    />

                    <BaseInput
                        :model-value="store.form.price ?? ''"
                        @update:modelValue="val => store.form.price = val === '' ? null : Number(val)"
                        type="number"
                        label="Цена"
                        :error="store.errors.price"
                    />

                    <BaseInput
                        v-model="store.form.photo_url"
                        label="Фото"
                        :error="store.errors.photo_url"
                    />

                    <BaseInput
                        v-model="store.form.contacts"
                        label="Контакты"
                        :error="store.errors.contacts"
                    />

                </div>

                <div class="col-6">

                    <BaseInput
                        v-model="store.form.brand"
                        label="Марка"
                        :error="store.errors.brand"
                    />

                    <BaseInput
                        v-model="store.form.model"
                        label="Модель"
                        :error="store.errors.model"
                    />

                    <BaseInput
                        v-model="store.form.year"
                        type="number"
                        label="Год"
                        :error="store.errors.year"
                    />

                    <BaseInput
                        v-model="store.form.body"
                        label="Кузов"
                        :error="store.errors.body"
                    />

                    <BaseInput
                        v-model="store.form.mileage"
                        type="number"
                        label="Пробег"
                        :error="store.errors.mileage"
                    />

                </div>

            </div>

            <div class="mt-3">

                <BaseButton
                    type="submit"
                    variant="primary"
                    :disabled="store.submitting || store.generating"
                    :loading="store.submitting"
                >
                    <template #loading>
                        Отправляем...
                    </template>
                    Отправить
                </BaseButton>

                <BaseButton
                    type="button"
                    variant="secondary"
                    class="ms-2"
                    :disabled="store.submitting || store.generating"
                    :loading="store.generating"
                    @click="generate"
                >
                    <template #loading>
                        Получаем данные...
                    </template>
                    Сгенерировать
                </BaseButton>

            </div>

        </form>

    </div>
</template>
