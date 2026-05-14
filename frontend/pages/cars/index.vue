<script setup lang="ts">

import {computed, onMounted, ref} from 'vue'
import {useNuxtApp, useRoute, navigateTo} from '#imports'

import {useAuthStore} from '~/stores/auth'
import {useCarStore} from '~/stores/car'
import {useCartStore} from '~/stores/cart'

import {useCarApi} from '~/services/api/internal/car.api'

import type {Car, CarsResponse} from '~/types/car'

const nuxtApp = useNuxtApp()

const authStore = useAuthStore()
const carStore = useCarStore()
const cartStore = useCartStore()

const route = useRoute()
const carApi = useCarApi()

const clientReady = ref(false)

onMounted(() => {
    clientReady.value = true
})

const page = computed(() => Number(route.query.page || 1))

const carsKey = computed(() => `cars-page-${page.value}`)

const emptyMeta = (): CarsResponse => ({
    data: [],
    current_page: page.value,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: 0,
})

const {data: carsResponse, pending: listLoading} = useAsyncData(
    carsKey,
    () => carApi.fetchCars(page.value),
    {
        deep: false,
        default: emptyMeta,
        getCachedData(key) {
            return nuxtApp.payload.data[key] ?? nuxtApp.static?.data[key]
        },
    }
)

const meta = computed(() => carsResponse.value || null)
const cars = computed(() => carsResponse.value?.data || [])

const changePage = (newPage: number) => {
    navigateTo({
        path: '/cars',
        query: {page: newPage},
    })
}

const getImage = (car: any) => car.photo_url || '/images/default_car.jpg'

const formatPrice = (price?: number | null) =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(price ?? 0)

const addToCart = async (car: Car) => {
    await carStore.addToCart(car)
}

const isInCart = (carId: number | string) => {
    return !!cartStore.items[String(carId)]
}

const isAdding = (id: number | string) => carStore.isAdding(id)

</script>

<template>
    <div class="container mt-4">
        <h1 class="mb-4">Каталог</h1>

        <div
            v-if="meta"
            class="d-flex gap-2 mb-3 align-items-center flex-wrap"
        >
            <Pagination
                :meta="meta"
                :loading="listLoading"
                @change="changePage"
            />
        </div>

        <div v-if="listLoading" class="loading-overlay">
            <div class="loading-modal">
                <div class="spinner-border" role="status"></div>
                <div class="mt-2">Загрузка каталога...</div>
            </div>
        </div>

        <div class="row">
            <div
                v-for="car in cars"
                :key="car.id"
                class="col-4 mb-3"
            >
                <div class="card car-card text-center">

                    <NuxtLink
                        :to="`/cars/show/${car.id}`"
                        class="text-decoration-none text-dark"
                    >
                        <img
                            :src="getImage(car)"
                            class="card-img-top"
                            style="height: 200px; object-fit: contain;"
                            alt=""
                        >

                        <div class="card-body">
                            <h5>{{ car.title }} [id: {{ car.id }}]</h5>

                            <p v-if="authStore.user" class="mb-0">
                                <span class="fs-5 fw-bold text-success">
                                    {{ formatPrice(car.price) }}
                                </span>
                            </p>

                            <p v-else class="text-muted">
                                Авторизуйтесь, чтобы увидеть цену
                            </p>
                        </div>
                    </NuxtLink>

                    <div v-if="authStore.user" class="p-3 pt-0">

                        <div v-if="!clientReady" class="w-100 btn btn-light disabled">
                            Проверка корзины...
                        </div>

                        <template v-else>

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
                                @click.stop="addToCart(car)"
                            >
                                <span v-if="isAdding(car.id)">
                                    Добавляется...
                                </span>
                                <span v-else>
                                    В корзину
                                </span>
                            </BaseButton>

                        </template>

                    </div>

                </div>
            </div>
        </div>

        <div v-if="meta" class="d-flex gap-2 mb-3 align-items-center flex-wrap">
            <Pagination
                :meta="meta"
                :loading="listLoading"
                @change="changePage"
            />
        </div>

        <div v-if="meta" class="mt-2 text-muted small">
            Страница {{ meta.current_page }} / {{ meta.last_page }}
            · Показано {{ meta.from }}–{{ meta.to }}
            из {{ meta.total }}
        </div>

    </div>
</template>

<style scoped>

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
