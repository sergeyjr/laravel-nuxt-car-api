<script setup lang="ts">

import {computed, reactive, ref, onMounted, watch} from 'vue'

import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'

import {useAuthStore} from '~/stores/auth'
import {useCarStore} from '~/stores/car'
import {useCartStore} from '~/stores/cart'

import type {LoginPayload} from '~/types/auth'
import type {Car} from '~/types/car'

import {formatPrice} from '~/utils/formatters'

import LoginModal from '~/components/modals/LoginModal.vue'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

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
const authLoading = ref(false)
const authErrors = reactive<Record<string, string>>({})
const initialLoading = ref(false)

/* -----------------------------
   route
------------------------------*/

const page = computed(() => Number(route.query.page || 1))

/* -----------------------------
   load data
------------------------------*/

const loadCars = async (p: number) => {
    await carStore.fetch(p)
}

/* initial load (first visit) */
onMounted(async () => {

    if (carStore.hasPage(page.value)) {
        return
    }

    try {
        initialLoading.value = true
        await loadCars(page.value)
    } finally {
        initialLoading.value = false
    }
})

/* pagination change */
watch(page, async (newPage) => {
    await loadCars(newPage)
})

/* -----------------------------
   store bindings
------------------------------*/

const listLoading = computed(() => carStore.listLoading)
const meta = computed(() => carStore.meta)
const cars = computed(() => carStore.cars)

/* unified loader */
const pageLoading = computed(() =>
    initialLoading.value || listLoading.value
)

/* -----------------------------
   helpers
------------------------------*/

// open auth modal
const openAuthModal = (event?: Event) => {

    event?.stopPropagation()
    event?.preventDefault()

    Object.keys(authErrors).forEach(k => delete authErrors[k])

    showAuth.value = true
}

// navigation
const changePage = (newPage: number) =>
    navigateTo({path: '/cars', query: {page: newPage}})

// image
const getImage = (car: Car) =>
    car.photo_url || '/images/default_car.jpg'

// cart state
const isInCart = (id: number | string) =>
    !!cartStore.items[String(id)]

// add to cart
const addToCart = (car: Car) =>
    carStore.addToCart(car)

// adding state
const isAdding = (id: number | string) =>
    carStore.isAdding(id)

/* -----------------------------
   auth
------------------------------*/

const confirmLogin = async (payload: LoginPayload) => {

    Object.keys(authErrors).forEach(k => delete authErrors[k])

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

        const ok = await authStore.login(email, password)

        if (ok) {
            showAuth.value = false
            return
        }

        Object.assign(authErrors, authStore.errors)

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
                <div class="mt-2">{{ t('catalog.loading') }}</div>
            </div>
        </div>

        <h1 class="mb-4">{{ t('catalog.title') }}</h1>

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
                            {{ t('catalog.loginForPrice') }}
                        </BaseButton>
                    </div>

                    <div v-if="authStore.user" class="p-3 pt-0">

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
                            @click.stop="addToCart(car)"
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
        </div>

        <div v-if="meta" class="d-flex gap-2 mb-3 align-items-center flex-wrap">
            <Pagination
                :meta="meta"
                :loading="listLoading"
                @change="changePage"
            />
        </div>

        <div v-if="meta" class="mt-2 text-muted small">
            {{ t('catalog.page') }} {{ meta.current_page }} / {{ meta.last_page }}
            · {{ t('catalog.shown') }} {{ meta.from }}–{{ meta.to }}
            {{ t('catalog.of') }} {{ meta.total }}
        </div>

        <LoginModal
            v-model:show="showAuth"
            :loading="authLoading"
            :errors="authErrors"
            @confirm="confirmLogin"
        />

    </div>
</template>

<style scoped>

.loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(55, 55, 55, 0.6);
    /* backdrop-filter: blur(2px); */
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
