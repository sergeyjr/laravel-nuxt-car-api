<script setup lang="ts">

import {useRouter} from 'vue-router'

import {useAuthStore} from '~/stores/auth'
import {useCarStore} from '~/stores/car'

import BaseButton from '~/components/BaseButton.vue'

import {formatPrice} from '~/utils/formatters'
import {openCar} from '~/utils/navigation'

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

const modules = [Navigation, Pagination]

const swiperOptions = {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 20,
    navigation: true,
    pagination: {clickable: true},
    loop: true,
    speed: 600,
    breakpoints: {
        320: {slidesPerView: 1, slidesPerGroup: 1},
        768: {slidesPerView: 2, slidesPerGroup: 2},
        1024: {slidesPerView: 3, slidesPerGroup: 3}
    }
}

/* -----------------------------
   cars
------------------------------*/

const carStore = useCarStore()

// await useAsyncData(
//     'latest-cars',
//     () => carStore.fetchLatest()
// )

onMounted(() => {
    carStore.fetchLatest()
})

/* -----------------------------
   helpers
------------------------------*/

// image fallback
const getImage = (car: any) =>
    car?.photo_url || '/images/default_car.jpg'

// image fallback handler
const onImgError = (e: Event) => {
    const target = e.target as HTMLImageElement
    target.src = '/images/default_car.jpg'
}

</script>

<template>
    <div class="container my-4">

        <div class="text-center mb-5">

            <h1 class="display-5 fw-bold">Главная страница</h1>

            <p class="text-muted">Laravel 13 + Nuxt 4 + Pinia 3</p>

        </div>

        <div class="row g-4">

            <!-- USER STATUS -->
            <div class="col-md-6">

                <div class="card shadow-sm h-100">

                    <div class="card-body">

                        <h4 class="mb-4">Статус пользователя</h4>

                        <div v-if="authStore.isAuth">

                            <p class="text-muted">Добро пожаловать, {{ authStore.user?.name }}</p>

                            <p class="text-success mb-0">Вы авторизованы</p>

                        </div>

                        <div v-else>

                            <p class="text-warning mb-0">Вы гость</p>

                            <small class="text-muted">Войдите или зарегистрируйтесь</small>

                        </div>

                    </div>

                </div>

            </div>

            <!-- ACTIONS -->
            <div class="col-md-6">

                <div class="card shadow-sm h-100">

                    <div class="card-body">

                        <h4 class="mb-4">Быстрые действия</h4>

                        <template v-if="authStore.isAuth">

                            <BaseButton
                                class="w-100 mb-2"
                                @click="router.push('/dashboard')"
                            >
                                Личный кабинет
                            </BaseButton>

                            <BaseButton
                                class="w-100 mb-2"
                                @click="router.push('/dashboard/profile')"
                            >
                                Профиль
                            </BaseButton>

                        </template>

                        <template v-else>

                            <BaseButton
                                class="w-100 mb-2"
                                @click="router.push('/login')"
                            >
                                Войти
                            </BaseButton>

                            <BaseButton
                                variant="secondary"
                                class="w-100"
                                @click="router.push('/register')"
                            >
                                Регистрация
                            </BaseButton>

                        </template>

                    </div>

                </div>

            </div>

            <!-- CARS -->
            <div class="col-12 mt-5">

                <h2 class="mb-4">Новинки</h2>

                <ClientOnly>

                    <template v-if="carStore.latestLoading">
                        <div class="alert alert-light mb-3">Загрузка новинок...</div>
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
                                            Авторизуйтесь, чтобы увидеть цену
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
