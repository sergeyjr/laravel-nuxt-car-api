<script setup lang="ts">

import {useCarStore} from '~/stores/car'

import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'

/* -----------------------------
   store
------------------------------*/

const carStore = useCarStore()

/* -----------------------------
   init
------------------------------*/

carStore.reset()

/* -----------------------------
   actions
------------------------------*/

const submit = async () => {
    try {
        const result = await carStore.submitCreateCarForm()
        // if (result?.id) {
        //     await navigateTo(`/cars/show/${result.id}`)
        // }
    } catch (e) {
        console.error(e)
    }
}

const generate = async () => {
    try {
        await carStore.generateCarForm()
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
                        v-model="carStore.form.title"
                        label="Заголовок"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.title"
                    />

                    <BaseInput
                        v-model="carStore.form.description"
                        label="Описание"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.description"
                    />

                    <BaseInput
                        :model-value="carStore.form.price ?? ''"
                        @update:modelValue="val => carStore.form.price = val === '' ? '' : Number(val)"
                        type="number"
                        label="Цена"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.price"
                    />

                    <BaseInput
                        v-model="carStore.form.photo_url"
                        label="Фото"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.photo_url"
                    />

                    <BaseInput
                        v-model="carStore.form.contacts"
                        label="Контакты"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.contacts"
                    />

                </div>

                <div class="col-6">

                    <BaseInput
                        v-model="carStore.form.brand"
                        label="Марка"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.brand"
                    />

                    <BaseInput
                        v-model="carStore.form.model"
                        label="Модель"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.model"
                    />

                    <BaseInput
                        v-model="carStore.form.year"
                        type="number"
                        label="Год"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.year"
                    />

                    <BaseInput
                        v-model="carStore.form.body"
                        label="Кузов"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.body"
                    />

                    <BaseInput
                        v-model="carStore.form.mileage"
                        type="number"
                        label="Пробег"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.mileage"
                    />

                </div>

            </div>

            <div class="mt-3">

                <BaseButton
                    type="submit"
                    variant="primary"
                    :disabled="carStore.submitting || carStore.generating"
                    :loading="carStore.submitting"
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
                    :disabled="carStore.submitting || carStore.generating"
                    :loading="carStore.generating"
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
