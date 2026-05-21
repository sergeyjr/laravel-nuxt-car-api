<script setup lang="ts">
import {computed, reactive, ref} from 'vue'

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
const authLoading = ref(false)
const firstLoad = ref(true)

const authErrors = reactive<Record<string, string>>({})

/* -----------------------------
   route
------------------------------*/

const page = computed(() =>
    Number(route.query.page || 1)
)

const sort = computed(() => {
    const raw = String(route.query.sort || '-id')

    const guestAllowed = [
        '-id',
        'id',
        'title',
        '-title',
    ]

    const authAllowed = [
        ...guestAllowed,
        'price',
        '-price',
    ]

    const allowed = authStore.user
        ? authAllowed
        : guestAllowed

    return allowed.includes(raw)
        ? raw
        : '-id'
})

/* -----------------------------
   computed
------------------------------*/

const listLoading = computed(() =>
    carStore.listLoading
)

const pageLoading = computed(() =>
    firstLoad.value || listLoading.value
)

const meta = computed(() =>
    carStore.meta
)

const cars = computed(() =>
    carStore.cars
)

const sortOptions = computed(() => {
    const options = [
        {
            value: '-id',
            label: 'Сначала новые',
        },
        {
            value: 'id',
            label: 'Сначала старые',
        },
        {
            value: 'title',
            label: 'По названию А → Я',
        },
        {
            value: '-title',
            label: 'По названию Я → А',
        },
    ]

    if (authStore.user) {
        options.push(
            {
                value: 'price',
                label: 'Сначала дешёвые',
            },
            {
                value: '-price',
                label: 'Сначала дорогие',
            },
        )
    }

    return options
})

/* -----------------------------
   load data
------------------------------*/

const loadCars = async (
    currentPage: number,
    currentSort: string,
) => {
    try {
        await carStore.fetch(
            currentPage,
            currentSort,
        )
    } finally {
        if (firstLoad.value) {
            firstLoad.value = false
        }
    }
}

useAsyncData(
    () => `catalog-page-${page.value}-${sort.value}`,
    () => loadCars(page.value, sort.value),
    {
        server: false,
        watch: [page, sort],
    },
)

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

const changePage = (newPage: number) =>
    navigateTo(localePath({
        path: '/catalog',
        query: {
            ...route.query,
            page: newPage,
            sort: sort.value,
        },
    }))

const changeSort = (newSort: string) =>
    navigateTo(localePath({
        path: '/catalog',
        query: {
            ...route.query,
            page: 1,
            sort: newSort,
        },
    }))

const getImage = (car: Car) =>
    car.photo_url || '/images/default_car.jpg'

const isInCart = (id: number | string) =>
    !!cartStore.items[String(id)]

const isAdding = (id: number | string) =>
    carStore.isAdding(id)

const addToCart = (car: Car) =>
    carStore.addToCart(car)

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
</script>

<template>
    <div class="container mt-4">

        <!-- LOADING -->
        <div
            v-if="pageLoading"
            class="loading-overlay"
        >
            <div class="loading-modal">
                <div
                    class="spinner-border"
                    role="status"
                />

                <div class="mt-2">
                    {{ t('catalog.loading') }}
                </div>
            </div>
        </div>

        <!-- HEADER -->
        <h1 class="mb-4">
            {{ t('catalog.title') }}
        </h1>

        <!-- TOP CONTROLS -->
        <div
            v-if="!firstLoad"
            class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3"
        >

            <div class="d-flex align-items-center gap-2">

                <label class="form-label mb-0 fw-semibold">
                    Сортировка
                </label>

                <select
                    class="form-select"
                    style="min-width: 240px;"
                    :value="sort"
                    @change="changeSort(($event.target as HTMLSelectElement).value)"
                >
                    <option
                        v-for="option in sortOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ option.label }}
                    </option>
                </select>

            </div>

            <Pagination
                v-if="meta"
                :meta="meta"
                @change="changePage"
            />

        </div>

        <!-- GRID -->
        <div class="row">

            <div
                v-for="car in cars"
                :key="car.id"
                class="col-4 mb-3"
            >

                <div class="card car-card text-center">

                    <NuxtLink
                        :to="localePath(`/catalog/show/${car.id}`)"
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

                        <h5 class="mb-3">
                            {{ car.title }}
                        </h5>

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

                    </div>

                    <div
                        v-if="authStore.user"
                        class="p-3 pt-0"
                    >

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

        <!-- BOTTOM CONTROLS -->
        <div
            v-if="!firstLoad"
            class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3"
        >

            <div class="d-flex align-items-center gap-2">

                <div
                    v-if="meta"
                    class="mt-2 text-muted small"
                >
                    {{ t('catalog.page') }}
                    {{ meta.current_page }}
                    /
                    {{ meta.last_page }}

                    ·

                    {{ t('catalog.shown') }}
                    {{ meta.from }}–{{ meta.to }}

                    {{ t('catalog.of') }}
                    {{ meta.total }}
                </div>

            </div>

            <Pagination
                v-if="meta"
                :meta="meta"
                @change="changePage"
            />

        </div>

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
.loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(55, 55, 55, 0.6);
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
