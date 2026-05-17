<script setup lang="ts">

import {useCarStore} from '~/stores/car'
import {useI18n} from 'vue-i18n'

import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

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

        <h1 class="mb-4">{{ t('car.createTitle') }}</h1>

        <form @submit.prevent="submit">

            <div class="row">

                <div class="col-6">

                    <BaseInput
                        v-model="carStore.form.title"
                        :label="t('car.title')"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.title"
                    />

                    <BaseInput
                        v-model="carStore.form.description"
                        :label="t('car.description')"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.description"
                    />

                    <BaseInput
                        :model-value="carStore.form.price ?? ''"
                        @update:modelValue="val => carStore.form.price = val === '' ? '' : Number(val)"
                        type="number"
                        :label="t('car.price')"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.price"
                    />

                    <BaseInput
                        v-model="carStore.form.photo_url"
                        :label="t('car.photo')"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.photo_url"
                    />

                    <BaseInput
                        v-model="carStore.form.contacts"
                        :label="t('car.contacts')"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.contacts"
                    />

                </div>

                <div class="col-6">

                    <BaseInput
                        v-model="carStore.form.brand"
                        :label="t('car.brand')"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.brand"
                    />

                    <BaseInput
                        v-model="carStore.form.model"
                        :label="t('car.model')"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.model"
                    />

                    <BaseInput
                        v-model="carStore.form.year"
                        type="number"
                        :label="t('car.year')"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.year"
                    />

                    <BaseInput
                        v-model="carStore.form.body"
                        :label="t('car.body')"
                        :disabled="carStore.submitting || carStore.generating"
                        :error="carStore.errors.body"
                    />

                    <BaseInput
                        v-model="carStore.form.mileage"
                        type="number"
                        :label="t('car.mileage')"
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
                        {{ t('car.sending') }}
                    </template>
                    {{ t('car.submit') }}
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
                        {{ t('car.generating') }}
                    </template>
                    {{ t('car.generate') }}
                </BaseButton>

            </div>

        </form>

    </div>
</template>
