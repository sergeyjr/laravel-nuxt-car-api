<script setup lang="ts">

import {useRouter} from 'vue-router'

import {useAuthStore} from '~/stores/auth'
import {useCarStore} from '~/stores/car'

import BaseButton from '~/components/ui/base/BaseButton.vue'

import {formatPrice} from '~/utils/formatters'

/* -----------------------------
   NUXT i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

/* -----------------------------
   router
------------------------------*/

const router = useRouter()

/* -----------------------------
   auth
------------------------------*/

const authStore = useAuthStore()

/* -----------------------------
   swiper
------------------------------*/

import {Navigation, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {useI18n} from "vue-i18n";

const modules = [Navigation, Pagination]

const swiperOptions = {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 20,
    navigation: false,
    pagination: {
        clickable: true
    },
    loop: true,
    speed: 600,
    breakpoints: {
        320: {slidesPerView: 1, slidesPerGroup: 1},
        768: {slidesPerView: 2, slidesPerGroup: 2},
        1024: {slidesPerView: 3, slidesPerGroup: 3}
    }
}

/* -----------------------------
   catalog
------------------------------*/

const carStore = useCarStore()

/* -----------------------------
   helpers
------------------------------*/

const getImage = (car: any) =>
    car?.photo_url || '/images/default_car.jpg'

const onImgError = (e: Event) => {
    const target = e.target as HTMLImageElement
    target.src = '/images/default_car.jpg'
}

const openCar = (id: number | string) =>
    navigateTo(localePath(`/catalog/show/${id}`))

/* -----------------------------
   lifecycle
------------------------------*/

onMounted(() => {
    carStore.fetchLatest()
})

/* -----------------------------
   links
------------------------------*/

const quickLinks = [
    {
        to: '/catalog',
        icon: 'bi-grid-1x2',
        label: 'Каталог',
        hint: 'Все автомобили',
        auth: null,
    },
    {
        to: '/page/about',
        icon: 'bi-info-circle',
        label: 'О проекте',
        hint: 'Кратко о сервисе',
        auth: null,
    },
    {
        to: '/page/info',
        icon: 'bi-card-text',
        label: 'Инфо',
        hint: 'Полезные материалы',
        auth: null,
    },
    {
        to: '/contact',
        icon: 'bi-telephone',
        label: 'Контакты',
        hint: 'Связаться с нами',
        auth: null,
    },

    // AUTH ONLY
    {
        to: '/dashboard',
        icon: 'bi-person-badge',
        label: 'Личный кабинет',
        hint: 'Профиль и заказы',
        auth: true,
    },
    {
        to: '/dashboard/profile',
        icon: 'bi-person-circle',
        label: 'Мой профиль',
        hint: 'Настройки аккаунта',
        auth: true,
    },
    {
        to: '/cart',
        icon: 'bi-cart3',
        label: 'Корзина',
        hint: 'Выбранные авто',
        auth: true,
    },

    // GUEST ONLY
    {
        to: '/login',
        icon: 'bi-box-arrow-in-right',
        label: 'Вход',
        hint: 'Авторизация в системе',
        auth: false,
    },
    {
        to: '/register',
        icon: 'bi-person-plus',
        label: 'Регистрация',
        hint: 'Создать аккаунт',
        auth: false,
    },
] as const

const filteredLinks = computed(() => {
    return quickLinks.filter(l => {
        if (l.auth === null) return true
        if (l.auth) return authStore.isAuth
        if (!l.auth) return !authStore.isAuth
        return true
    })
})

const onLogout = async () => {
    if (!authStore.isAuth) return
    await authStore.logout()
    await navigateTo(localePath('/'))
}

</script>

<template>
    <div class="container my-4">

        <div class="text-center mb-5">

            <h1 class="display-5 fw-bold mb-3">
                {{ t('home.title') }}
            </h1>

            <p class="text-muted">Laravel 13 + Nuxt 4 (Nitro 2, Vite 7, Vue 3) + Pinia 3</p>

        </div>

        <div class="row g-4">

            <!-- DASHBOARD TILES -->
            <div class="col-12 mt-4">

                <div class="row g-3">

                    <div
                        v-for="link in filteredLinks"
                        :key="link.to"
                        class="col-12 col-sm-6 col-lg-4"
                    >

                        <NuxtLink :to="localePath(link.to)" class="tile-card">
                            <div class="tile-icon">
                                <i :class="`bi ${link.icon}`"></i>
                            </div>

                            <div class="tile-content">
                                <div class="tile-title">
                                    {{ link.label }}
                                </div>
                                <div class="tile-hint">
                                    {{ link.hint }}
                                </div>
                            </div>

                        </NuxtLink>

                    </div>

                    <!-- LOGOUT TILE -->
                    <div
                        v-if="authStore.isAuth"
                        class="col-12 col-sm-6 col-lg-4"
                    >
                        <button class="tile-card tile-button" @click="onLogout">
                            <div class="tile-icon">
                                <i class="bi bi-box-arrow-right"></i>
                            </div>

                            <div class="tile-content">
                                <div class="tile-title">
                                    Выход
                                </div>
                                <div class="tile-hint">
                                    Завершить сессию
                                </div>
                            </div>
                        </button>
                    </div>

                </div>
            </div>

            <!-- CARS -->
            <div class="col-12 mt-5">

                <h2 class="mb-4">{{ t('home.newArrivals') }}</h2>

                <ClientOnly>

                    <template v-if="carStore.latestLoading">
                        <div class="alert alert-light mb-3">
                            {{ t('home.loading') }}
                        </div>
                    </template>

                    <template v-else>

                        <Swiper
                            v-if="carStore.latest.length"
                            :modules="modules"
                            v-bind="swiperOptions"
                            class="swiper-custom"
                        >

                            <SwiperSlide
                                v-for="car in carStore.latest"
                                :key="car.id"
                            >

                                <div
                                    class="card h-100 text-center"
                                    style="cursor:pointer"
                                    @click="openCar(car.id)"
                                >

                                    <img
                                        :src="getImage(car)"
                                        class="card-img-top"
                                        alt=""
                                        @error="onImgError"
                                    />

                                    <div class="card-body">

                                        <h5>{{ car.title }}</h5>

                                        <p v-if="authStore.user && car.price" class="mb-0">
                                            <span class="fs-5 fw-bold text-success">
                                                {{ formatPrice(car.price) }}
                                            </span>
                                        </p>

                                        <p v-else class="text-muted">
                                            {{ t('home.priceHint') }}
                                        </p>

                                    </div>

                                </div>

                            </SwiperSlide>

                        </Swiper>

                    </template>

                </ClientOnly>

            </div>

        </div>

    </div>
</template>

<style scoped>

.tile-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 10px;

    min-height: 170px;
    padding: 22px;

    border-radius: 18px;
    text-decoration: none;
    color: #0f172a;

    background: linear-gradient(180deg, rgba(255, 255, 255, .92), rgba(248, 250, 252, .96));
    border: 1px solid rgba(148, 163, 184, .22);

    overflow: hidden;
    transition: transform .22s ease,
    box-shadow .22s ease,
    border-color .22s ease,
    background .22s ease;

    text-align: center;
}

.tile-button {
    width: 100%;
    border: none;
    cursor: pointer;
    background: linear-gradient(180deg, rgba(255, 235, 235, .9), rgba(255, 245, 245, .95));
}

.tile-card:hover {
    transform: translateY(-4px);
    border-color: rgba(59, 130, 246, .35);
    box-shadow: 0 10px 15px rgba(15, 23, 42, .12),
    0 0 0 1px rgba(59, 130, 246, .08);
}

.tile-icon {
    width: 84px;
    height: 84px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 20px;

    color: #2563eb;
}

.tile-icon i {
    font-size: 3.2rem;
}

.tile-title {
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1.2;
}

.tile-hint {
    font-size: .9rem;
    color: #64748b;
}

.tile-arrow {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    flex: 0 0 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(59, 130, 246, .08);
    color: #2563eb;
    transition: transform .22s ease, background .22s ease;
}

.tile-card:hover .tile-arrow {
    transform: translate(2px, -2px);
    background: rgba(59, 130, 246, .14);
}

@media (max-width: 576px) {
    .tile-card {
        min-height: 88px;
        padding: 16px;
    }

    .tile-icon {
        width: 46px;
        height: 46px;
        flex-basis: 46px;
        border-radius: 14px;
    }

    .tile-title {
        font-size: .98rem;
    }

    .tile-hint {
        font-size: .84rem;
    }
}

/* SWIPER */

.swiper-custom {
    padding: 20px 0 40px 0;
}

.swiper-custom :deep(.swiper-wrapper) {
    margin: 0;
}

.swiper-custom :deep(.swiper-slide) {
    overflow: visible;
}

.swiper-custom :deep(.swiper-slide) .card {
    transition: transform .25s ease, box-shadow .25s ease;
    will-change: transform;
}

.swiper-custom :deep(.swiper-slide):hover .card {
    box-shadow: 0 0 8px rgba(0, 0, 0, .18);
    z-index: 10;
}

.swiper-custom :deep(.card-img-top) {
    width: 100%;
    height: 200px;
    object-fit: contain;
    display: block;
}

.swiper-custom :deep(.swiper-pagination) {
    bottom: 0 !important;
}

</style>
