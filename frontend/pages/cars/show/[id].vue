<script setup lang="ts">

import {computed, ref, watch} from 'vue'
import {navigateTo, useNuxtApp, useRoute} from '#imports'

import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'
import {useCarStore} from '~/stores/car'

import type {Car} from '~/types/car'

import AuthModal from '~/components/modals/AuthModal.vue'

const nuxtApp = useNuxtApp()

const route = useRoute()

const authStore = useAuthStore()
const cartStore = useCartStore()
const carStore = useCarStore()

const showAuth = ref(false)
const showImage = ref(false)

const carId = computed(() => Number(route.params.id))

const openAuthModal = (event?: Event) => {

    event?.stopPropagation()
    event?.preventDefault()

    showAuth.value = true

}

const carKey = computed(() => `car-${carId.value}`)

const {pending: carLoading} = await useAsyncData<Car | null>(
    carKey,
    async () => {

        return await carStore.fetchCar(carId.value)

    },
    {
        default: () => null,

        getCachedData(key) {

            return (
                nuxtApp.payload.data[key]
                ?? nuxtApp.static?.data[key]
            )

        },
    }
)

watch(
    carId,
    async (value) => {

        await carStore.fetchCar(value)

    },
    {
        immediate: true,
    }
)

const car = computed(() => carStore.car)

const carImage = computed(() => {
    return car.value?.photo_url || '/images/default_car.jpg'
})

const formatPrice = (price?: number | null) => {

    return new Intl.NumberFormat('ru-RU').format(price ?? 0) + ' ₽'

}

const isInCart = (id: number | string) => {

    return !!cartStore.items[String(id)]

}

const addToCart = async (carItem: Car) => {

    await carStore.addToCart(carItem)

}

const isAdding = (id: number | string) => {

    return carStore.isAdding(id)

}

const openImage = () => {
    showImage.value = true
}

const closeImage = () => {
    showImage.value = false
}

const goBack = () => {

    if (
        import.meta.client &&
        history.state?.back
    ) {
        window.history.back()
    } else {
        navigateTo('/cars')
    }

}

</script>

<template>
    <div class="container mt-4 position-relative">

        <div v-if="!carLoading && !car">
            Автомобиль не найден
        </div>

        <template v-else-if="car">

            <div class="row">

                <div class="col-12">
                    <h1 class="mb-4">
                        {{ car.title }} [id: {{ car.id }}]
                    </h1>
                </div>

                <div class="col-md-5">

                    <div class="car-image-wrapper">

                        <img
                            :src="carImage"
                            class="img-fluid rounded car-image"
                            style="max-height:400px;object-fit:contain;"
                            alt=""
                            @click="openImage"
                        >

                    </div>

                    <div
                        v-if="showImage"
                        class="image-modal"
                        @click="closeImage"
                    >

                        <img
                            :src="carImage"
                            class="image-full"
                            @click.stop
                            alt=""
                        >

                    </div>

                </div>

                <div class="col-md-7">

                    <div class="table-responsive mb-3">

                        <table class="table table-sm align-middle mb-0 description-table">

                            <tbody>

                            <tr v-if="car.description">
                                <td class="text-muted fw-semibold w-25">
                                    Описание
                                </td>
                                <td>
                                    {{ car.description }}
                                </td>
                            </tr>

                            <tr v-if="car.options?.brand">
                                <td class="text-muted fw-semibold">
                                    Бренд
                                </td>
                                <td>
                                    {{ car.options.brand }}
                                </td>
                            </tr>

                            <tr v-if="car.options?.model">
                                <td class="text-muted fw-semibold">
                                    Модель
                                </td>
                                <td>
                                    {{ car.options.model }}
                                </td>
                            </tr>

                            <tr v-if="car.options?.year">
                                <td class="text-muted fw-semibold">
                                    Год
                                </td>
                                <td>
                                    {{ car.options.year }}
                                </td>
                            </tr>

                            <tr v-if="car.options?.mileage">
                                <td class="text-muted fw-semibold">
                                    Пробег
                                </td>
                                <td>
                                    {{ car.options.mileage }}
                                </td>
                            </tr>

                            <tr v-if="authStore.user && car.price">

                                <td class="text-muted fw-semibold">
                                    Цена
                                </td>

                                <td>
                                    {{ formatPrice(car.price) }}
                                </td>

                            </tr>

                            <tr v-else>

                                <td class="text-muted fw-semibold">
                                    Цена
                                </td>

                                <td>

                                    <button
                                        type="button"
                                        class="btn btn-light"
                                        @click.stop.prevent="openAuthModal"
                                    >
                                        Авторизуйтесь, чтобы увидеть цену
                                    </button>

                                </td>

                            </tr>

                            </tbody>

                        </table>

                    </div>

                    <div v-if="authStore.user">

                        <BaseButton
                            v-if="isInCart(car.id)"
                            variant="light"
                            class="w-100"
                            disabled
                        >
                            Товар в корзине
                        </BaseButton>

                        <BaseButton
                            v-else
                            variant="success"
                            class="w-100"
                            :disabled="isAdding(car.id)"
                            @click="addToCart(car)"
                        >

                            <span v-if="isAdding(car.id)">
                                Добавляется...
                            </span>

                            <span v-else>
                                В корзину
                            </span>

                        </BaseButton>

                    </div>

                </div>

            </div>

            <hr>

            <div class="d-flex justify-content-between align-items-center">

                <BaseButton
                    variant="light"
                    @click="goBack"
                >
                    ← Назад
                </BaseButton>

                <NuxtLink
                    to="/cars"
                    class="text-decoration-none"
                >

                    <BaseButton variant="light">
                        В каталог →
                    </BaseButton>

                </NuxtLink>

            </div>

        </template>

        <div
            v-if="carLoading"
            class="loading-overlay"
        >

            <div class="loading-modal">

                <div
                    class="spinner-border"
                    role="status"
                    aria-label="Загрузка"
                />

                <div class="mt-2">
                    Загрузка автомобиля...
                </div>

            </div>

        </div>

        <AuthModal v-model="showAuth"/>

    </div>
</template>

<style scoped>

.car-image-wrapper {
    display: inline-block;
    overflow: hidden;
}

.car-image {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.car-image:hover {
    transform: scale(1.05);
}

.image-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.image-full {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    cursor: zoom-out;
}

.description-table tr {
    border-bottom: 1px solid #e9ecef;
}

.description-table tr:last-child {
    border-bottom: none;
    border-color: transparent;
}

.description-table td {
    padding: 10px 12px;
}

.loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.loading-modal {
    background: white;
    padding: 20px 30px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    text-align: center;
}

</style>
