<script setup lang="ts">

import {computed, ref, onMounted, watch} from 'vue'

import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'

import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'
import {useCarStore} from '~/stores/car'

import type {LoginPayload} from '~/types/auth'
import type {Car} from '~/types/car'

import {formatPrice} from '~/utils/formatters'

import LoginModal from '~/components/modals/LoginModal.vue'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

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

const car = computed(() =>
    carStore.getCar(carId.value)
)

const carLoading = computed(() =>
    carStore.isCarLoading(carId.value)
)

const carImage = computed(() =>
    car.value?.photo_url || '/images/default_car.jpg'
)

/* -----------------------------
   helpers
------------------------------*/

const isInCart = (id: number | string) =>
    !!cartStore.items[String(id)]

const isAdding = (id: number | string) =>
    carStore.isAdding(id)

/* -----------------------------
   actions
------------------------------*/

const openAuthModal = (event?: Event) => {
    event?.stopPropagation()
    event?.preventDefault()
    showAuth.value = true
}

const loadCar = async (id: number) => {
    await carStore.fetchCar(id)
}

const openImage = () => showImage.value = true

const closeImage = () => showImage.value = false

const goBack = () => {
    if (import.meta.client && window.history.length > 1) {
        window.history.back()
        return
    }
    navigateTo(localePath('/cars'))
}

const addToCart = (carItem: Car) =>
    carStore.addToCart(carItem)

const confirmLogin = async (payload: LoginPayload) => {
    authLoading.value = true
    try {
        const ok = await authStore.login(
            payload.email,
            payload.password
        )
        if (ok) {
            showAuth.value = false
        }
    } finally {
        authLoading.value = false
    }
}

/* -----------------------------
   lifecycle
------------------------------*/

onMounted(async () => {
    loaded.value = false
    await loadCar(carId.value)
    loaded.value = true
})

watch(carId, async (newId, oldId) => {
    if (!newId || newId === oldId) return
    loaded.value = false
    await loadCar(newId)
    loaded.value = true
})

</script>

<template>

    <div class="container mt-4">

        <template v-if="carLoading || !loaded">

            <div class="alert alert-light border text-center py-4">
                {{ t('page.loading') }}
            </div>

        </template>

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
                                <td colspan="2">
                                    <h5>{{ car.description }}</h5>
                                </td>
                            </tr>

                            <tr v-if="car.options?.brand">
                                <td class="text-muted fw-semibold w-50">
                                    {{ t('car.brand') }}
                                </td>
                                <td>{{ car.options.brand }}</td>
                            </tr>

                            <tr v-if="car.options?.model">
                                <td class="text-muted fw-semibold">
                                    {{ t('car.model') }}
                                </td>
                                <td>{{ car.options.model }}</td>
                            </tr>

                            <tr v-if="car.options?.year">
                                <td class="text-muted fw-semibold">
                                    {{ t('car.year') }}
                                </td>
                                <td>{{ car.options.year }}</td>
                            </tr>

                            <tr v-if="car.options?.mileage">
                                <td class="text-muted fw-semibold">
                                    {{ t('car.mileage') }}
                                </td>
                                <td>{{ car.options.mileage }}</td>
                            </tr>

                            <tr>

                                <td class="text-muted fw-semibold">
                                    {{ t('car.price') }}
                                </td>

                                <td>

                                    <p
                                        v-if="authStore.user && car.price"
                                        class="mb-0"
                                    >

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
                                        {{ t('catalog.loginForPrice') }}
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
                            {{ t('catalog.inCart') }}
                        </BaseButton>

                        <BaseButton
                            v-else
                            variant="success"
                            class="w-100"
                            :disabled="isAdding(car.id)"
                            @click="addToCart(car)"
                        >

                            <span v-if="isAdding(car.id)">
                                {{ t('catalog.adding') }}
                            </span>

                            <span v-else>
                                {{ t('catalog.addToCart') }}
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
                    ← {{ t('nav.back') }}
                </BaseButton>

                <NuxtLink
                    to="/cars"
                    class="text-decoration-none"
                >
                    <BaseButton variant="light">
                        {{ t('catalog.title') }} →
                    </BaseButton>
                </NuxtLink>

            </div>

            <LoginModal
                v-model:show="showAuth"
                :loading="authLoading"
                @confirm="confirmLogin"
            />

        </template>

        <template v-else>

            <div class="alert alert-light border text-center py-4">
                {{ t('page.notFound') }}
            </div>

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
