<script setup lang="ts">

import {computed, onMounted, reactive, ref, watch} from 'vue'

import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'

import {useAuthStore} from '~/stores/auth'
import {useCarStore} from '~/stores/car'
import {useCartStore} from '~/stores/cart'

import type {LoginPayload} from '~/types/auth'
import type {Car} from '~/types/car'

import {formatPrice} from '~/utils/formatters'

import LoginModal from '~/components/modals/auth/LoginModal.vue'
import BaseButton from '~/components/ui/base/BaseButton.vue'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

/* -----------------------------
   stores
------------------------------*/

const authStore = useAuthStore()
const carStore = useCarStore()
const cartStore = useCartStore()

const route = useRoute()

/* -----------------------------
   state
------------------------------*/

const showAuth = ref(false)
const showImage = ref(false)

const authLoading = ref(false)
const loaded = ref(false)

const authErrors = reactive<Record<string, string>>({})

/* -----------------------------
   route
------------------------------*/

const carId = computed(() =>
    Number(route.params.id)
)

/* -----------------------------
   computed
------------------------------*/

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
   load data
------------------------------*/

const loadCar = async (id: number) => {
    loaded.value = false

    try {
        await carStore.fetchCar(id)
    } finally {
        loaded.value = true
    }
}

/* -----------------------------
   helpers
------------------------------*/

const clearAuthErrors = () => {
    Object.keys(authErrors).forEach(key => {
        delete authErrors[key]
    })
}

const openAuthModal = (event?: Event) => {
    event?.stopPropagation()
    event?.preventDefault()

    clearAuthErrors()

    showAuth.value = true
}

const closeAuthModal = () => {
    showAuth.value = false
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
        window.history.length > 1
    ) {
        window.history.back()
        return
    }

    navigateTo(localePath('/catalog'))
}

const isInCart = (id: number | string) =>
    !!cartStore.items[String(id)]

const isAdding = (id: number | string) =>
    carStore.isAdding(id)

const addToCart = (carItem: Car) =>
    carStore.addToCart(carItem)

/* -----------------------------
   auth
------------------------------*/

const confirmLogin = async (
    payload: LoginPayload,
) => {
    clearAuthErrors()

    const {email, password} = payload

    if (!email) {
        authErrors.email = t('auth.emailRequired')
    }

    if (!password) {
        authErrors.password = t('auth.passwordRequired')
    }

    if (Object.keys(authErrors).length) {
        return
    }

    authLoading.value = true

    try {
        const success = await authStore.login(
            email,
            password,
        )

        if (success) {
            closeAuthModal()
            return
        }

        Object.assign(
            authErrors,
            authStore.errors,
        )
    } finally {
        authLoading.value = false
    }
}

/* -----------------------------
   lifecycle
------------------------------*/

onMounted(async () => {
    await loadCar(carId.value)
})

watch(carId, async (newId, oldId) => {
    if (!newId || newId === oldId) {
        return
    }

    await loadCar(newId)
})

</script>

<template>

    <div class="container mt-4">

        <!-- LOADING -->
        <template v-if="carLoading || !loaded">

            <div class="alert alert-light border text-center py-4">
                {{ t('page.loading') }}
            </div>

        </template>

        <!-- CONTENT -->
        <template v-else-if="car">

            <!-- HEADER -->
            <div class="d-flex justify-content-between align-items-center mb-4">

                <h1 class="mb-0">
                    {{ car.title }}
                </h1>

                <BaseButton
                    variant="light"
                    @click="goBack"
                >
                    ← {{ t('nav.back') }}
                </BaseButton>

            </div>

            <div class="row">

                <!-- IMAGE -->
                <div class="col-md-5">

                    <div class="car-image-wrapper">

                        <img
                            :src="carImage"
                            class="img-fluid rounded car-image"
                            style="max-height: 400px; object-fit: contain;"
                            alt=""
                            @click="openImage"
                        >

                    </div>

                </div>

                <!-- INFO -->
                <div class="col-md-7">

                    <div class="table-responsive mb-3">

                        <table class="table table-sm align-middle mb-0 description-table">

                            <tbody>

                            <tr v-if="car.description">

                                <td colspan="2">

                                    <h5 class="mb-0">
                                        {{ car.description }}
                                    </h5>

                                </td>

                            </tr>

                            <tr v-if="car.options?.brand">

                                <td class="text-muted fw-semibold w-50">
                                    {{ t('car.brand') }}
                                </td>

                                <td>
                                    {{ car.options.brand }}
                                </td>

                            </tr>

                            <tr v-if="car.options?.model">

                                <td class="text-muted fw-semibold">
                                    {{ t('car.model') }}
                                </td>

                                <td>
                                    {{ car.options.model }}
                                </td>

                            </tr>

                            <tr v-if="car.options?.year">

                                <td class="text-muted fw-semibold">
                                    {{ t('car.year') }}
                                </td>

                                <td>
                                    {{ car.options.year }}
                                </td>

                            </tr>

                            <tr v-if="car.options?.mileage">

                                <td class="text-muted fw-semibold">
                                    {{ t('car.mileage') }}
                                </td>

                                <td>
                                    {{ car.options.mileage }}
                                </td>

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

            <!-- IMAGE MODAL -->
            <div
                v-if="showImage"
                class="image-modal"
                @click="closeImage"
            >

                <img
                    :src="carImage"
                    class="image-full"
                    alt=""
                    @click.stop
                >

            </div>

            <hr>

            <!-- FOOTER -->
            <div class="d-flex justify-content-between align-items-center">

                <NuxtLink
                    :to="localePath('/catalog')"
                    class="text-decoration-none"
                >

                    <BaseButton variant="light">
                        ← {{ t('catalog.title') }}
                    </BaseButton>

                </NuxtLink>

            </div>

        </template>

        <!-- NOT FOUND -->
        <template v-else>

            <div class="alert alert-light border text-center py-4">
                {{ t('page.notFound') }}
            </div>

        </template>

    </div>

    <!-- AUTH MODAL -->
    <LoginModal
        :show="showAuth"
        :processing="authLoading"
        :errors="authErrors"
        @close="closeAuthModal"
        @confirm="confirmLogin"
    />

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
