<script setup lang="ts">

import {computed, ref, onMounted, watch} from 'vue'
import {useRoute} from 'vue-router'

import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'
import {useCarStore} from '~/stores/car'

import type {LoginPayload} from '~/types/auth'
import type {Car} from '~/types/car'

import AuthModal from '~/components/modals/AuthModal.vue'

/* -----------------------------
   stores
------------------------------*/

const authStore = useAuthStore()
const cartStore = useCartStore()
const carStore = useCarStore()

const route = useRoute()

/* -----------------------------
   state (ui)
------------------------------*/

const showAuth = ref(false)
const showImage = ref(false)
const loaded = ref(false)
const authLoading = ref(false)

/* -----------------------------
   computed route data
------------------------------*/

const carId = computed(() => Number(route.params.id))

const car = computed(() => carStore.car)

const carImage = computed(() =>
    car.value?.photo_url || '/images/default_car.jpg'
)

/* -----------------------------
   helpers
------------------------------*/

// цена
const formatPrice = (price?: number | null) =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(price ?? 0)

// корзина
const isInCart = (id: number | string) =>
    !!cartStore.items[String(id)]

// загрузка добавления
const isAdding = (id: number | string) =>
    carStore.isAdding(id)

/* -----------------------------
   actions
------------------------------*/

// открыть модалку логина
const openAuthModal = (event?: Event) => {
    event?.stopPropagation()
    event?.preventDefault()
    showAuth.value = true
}

// загрузка авто
const loadCar = async (id: number) => {
    await carStore.fetchCar(id)
}

// картинка
const openImage = () => showImage.value = true
const closeImage = () => showImage.value = false

// назад
const goBack = () => {
    if (import.meta.client && window.history.length > 1) {
        window.history.back()
    } else {
        navigateTo('/cars')
    }
}

// добавить в корзину
const addToCart = (carItem: Car) =>
    carStore.addToCart(carItem)

// логин из модалки
const confirmLogin = async (payload: LoginPayload) => {
    const {email, password} = payload

    authLoading.value = true
    try {
        const ok = await authStore.login(email, password)
        if (ok) showAuth.value = false
    } finally {
        authLoading.value = false
    }
}

/* -----------------------------
   lifecycle
------------------------------*/

// initial load
onMounted(() => {
    loadCar(carId.value)
    loaded.value = true
})

// react to route change
watch(carId, (newId) => {
    if (newId) loadCar(newId)
})

</script>

<template>
    <div class="container mt-4">

        <template v-if="carStore.carLoading">
            <div class="alert alert-light mb-4">
                Загрузка страницы...
            </div>
        </template>

        <template v-else>
            <template v-if="car">

                <div class="row">

                    <div class="col-12">
                        <h1 class="mb-4">{{ car.title }} [id: {{ car.id }}]</h1>
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

                        <div v-if="showImage" class="image-modal" @click="closeImage">
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
                                    <td class="text-muted fw-semibold w-25">Описание</td>
                                    <td>{{ car.description }}</td>
                                </tr>

                                <tr v-if="car.options?.brand">
                                    <td class="text-muted fw-semibold">Бренд</td>
                                    <td>{{ car.options.brand }}</td>
                                </tr>

                                <tr v-if="car.options?.model">
                                    <td class="text-muted fw-semibold">Модель</td>
                                    <td>{{ car.options.model }}</td>
                                </tr>

                                <tr v-if="car.options?.year">
                                    <td class="text-muted fw-semibold">Год</td>
                                    <td>{{ car.options.year }}</td>
                                </tr>

                                <tr v-if="car.options?.mileage">
                                    <td class="text-muted fw-semibold">Пробег</td>
                                    <td>{{ car.options.mileage }}</td>
                                </tr>

                                <tr>
                                    <td class="text-muted fw-semibold">Цена</td>
                                    <td>
                                        <p v-if="authStore.user && car.price" class="mb-0">
                                        <span class="fs-5 fw-bold text-success">
                                            {{ formatPrice(car.price) }}
                                        </span>
                                        </p>

                                        <BaseButton
                                            v-else
                                            type="button"
                                            class="btn btn-light"
                                            @click.stop.prevent="openAuthModal"
                                        >
                                            Авторизуйтесь, чтобы увидеть цену
                                        </BaseButton>
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
                                <span v-if="isAdding(car.id)">Добавляется...</span>
                                <span v-else>В корзину</span>
                            </BaseButton>

                        </div>

                    </div>

                </div>

                <hr>

                <div class="d-flex justify-content-between align-items-center">
                    <BaseButton variant="light" @click="goBack">← Назад</BaseButton>

                    <NuxtLink to="/cars" class="text-decoration-none">
                        <BaseButton variant="light">В каталог →</BaseButton>
                    </NuxtLink>
                </div>

                <AuthModal
                    v-model:show="showAuth"
                    :loading="authLoading"
                    @confirm="confirmLogin"
                />

            </template>

            <template v-else-if="loaded">
                <div class="alert alert-light mb-4">
                    Автомобиль не найден.
                </div>
            </template>

        </template>

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

</style>
