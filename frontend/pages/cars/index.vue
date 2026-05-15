<script setup lang="ts">

import {computed, ref, onMounted, watch} from 'vue'

import {useAuthStore} from '~/stores/auth'
import {useCarStore} from '~/stores/car'
import {useCartStore} from '~/stores/cart'

import type {LoginPayload} from '~/types/auth'
import type {Car} from '~/types/car'

import AuthModal from '~/components/modals/AuthModal.vue'

const authStore = useAuthStore()
const carStore = useCarStore()
const cartStore = useCartStore()

const route = useRoute()

const page = computed(() => Number(route.query.page || 1))

/**
 * первичная загрузка страницы
 * нужна, чтобы loader показался сразу при первом входе в каталог
 */
const initialLoading = ref(true)

const loadCars = async (newPage: number) => {
    await carStore.fetch(newPage)
}

onMounted(async () => {
    try {
        initialLoading.value = true
        await loadCars(page.value)
    } finally {
        initialLoading.value = false
    }
})

watch(page, async (newPage) => {
    await loadCars(newPage)
})

const listLoading = computed(() => carStore.listLoading)

/**
 * единый флаг для отображения прелоадера
 * - при первом входе: initialLoading
 * - при переходе между страницами: listLoading
 */
const pageLoading = computed(() => initialLoading.value || listLoading.value)

const meta = computed(() => carStore.meta)
const cars = computed(() => carStore.cars)

const showAuth = ref(false)

const openAuthModal = (event?: Event) => {
    event?.stopPropagation()
    event?.preventDefault()
    showAuth.value = true
}

const changePage = (newPage: number) =>
    navigateTo({path: '/cars', query: {page: newPage}})

const getImage = (car: Car) =>
    car.photo_url || '/images/default_car.jpg'

const formatPrice = (price?: number | null) =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(price ?? 0)

const isInCart = (id: number | string) =>
    !!cartStore.items[String(id)]

const addToCart = async (car: Car) =>
    carStore.addToCart(car)

const isAdding = (id: number | string) =>
    carStore.isAdding(id)

const authLoading = ref(false)

const confirmLogin = async (payload: LoginPayload) => {
    const {email, password} = payload
    authLoading.value = true
    try {
        const ok = await authStore.login(email, password)
        if (ok) {
            showAuth.value = false
        }
    } finally {
        authLoading.value = false
    }
}

</script>

<template>
    <div class="container mt-4">

        <div v-if="pageLoading" class="loading-overlay">
            <div class="loading-modal">
                <div class="spinner-border" role="status"></div>
                <div class="mt-2">Загрузка каталога...</div>
            </div>
        </div>

        <h1 class="mb-4">Каталог</h1>

        <div v-if="meta" class="d-flex gap-2 mb-3 align-items-center flex-wrap">
            <Pagination
                :meta="meta"
                :loading="listLoading"
                @change="changePage"
            />
        </div>

        <div class="row">
            <div v-for="car in cars" :key="car.id" class="col-4 mb-3">
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
                    </NuxtLink>

                    <div class="card-body">
                        <h5>{{ car.title }} [id: {{ car.id }}]</h5>

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
                    </div>

                    <div v-if="authStore.user" class="p-3 pt-0">

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
                            <span v-if="isAdding(car.id)">Добавляется...</span>
                            <span v-else>В корзину</span>
                        </BaseButton>

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

        <AuthModal
            v-model:show="showAuth"
            :loading="authLoading"
            @confirm="confirmLogin"
        />

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
