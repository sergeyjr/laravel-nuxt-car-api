<script setup lang="ts">

import {useRouter} from 'vue-router'

import {useAuthStore} from '~/stores/auth'
import {useCarStore} from '~/stores/car'

import BaseButton from '~/components/BaseButton.vue'

import {formatPrice} from '~/utils/formatters'
import {openCar} from '~/utils/navigation'

/* -----------------------------
   NUXT i18n
------------------------------*/

const {t} = useI18n()

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

onMounted(() => {
    carStore.fetchLatest()
})

/* -----------------------------
   helpers
------------------------------*/

const getImage = (car: any) =>
    car?.photo_url || '/images/default_car.jpg'

const onImgError = (e: Event) => {
    const target = e.target as HTMLImageElement
    target.src = '/images/default_car.jpg'
}

</script>

<template>
    <div class="container my-4">

        <div class="text-center mb-5">

            <h1 class="display-5 fw-bold">{{ t('home.title') }}</h1>

            <p class="text-muted">{{ t('home.stack') }}</p>

        </div>

        <div class="row g-4">

            <!-- USER STATUS -->
            <div class="col-md-6">

                <div class="card shadow-sm h-100">

                    <div class="card-body">

                        <h4 class="mb-4">{{ t('home.userStatusTitle') }}</h4>

                        <div v-if="authStore.isAuth">

                            <p class="text-muted">
                                {{ t('home.welcome') }}, {{ authStore.user?.name }}
                            </p>

                            <p class="text-success mb-0">
                                {{ t('home.loggedIn') }}
                            </p>

                        </div>

                        <div v-else>

                            <p class="text-warning mb-0">
                                {{ t('home.guest') }}
                            </p>

                            <small class="text-muted">
                                {{ t('home.authHint') }}
                            </small>

                        </div>

                    </div>

                </div>

            </div>

            <!-- ACTIONS -->
            <div class="col-md-6">

                <div class="card shadow-sm h-100">

                    <div class="card-body">

                        <h4 class="mb-4">{{ t('home.quickActions') }}</h4>

                        <template v-if="authStore.isAuth">

                            <BaseButton
                                class="w-100 mb-2"
                                @click="router.push('/dashboard')"
                            >
                                {{ t('home.buttons.dashboard') }}
                            </BaseButton>

                            <BaseButton
                                class="w-100 mb-2"
                                @click="router.push('/dashboard/profile')"
                            >
                                {{ t('home.buttons.profile') }}
                            </BaseButton>

                        </template>

                        <template v-else>

                            <BaseButton
                                class="w-100 mb-2"
                                @click="router.push('/login')"
                            >
                                {{ t('home.buttons.login') }}
                            </BaseButton>

                            <BaseButton
                                variant="secondary"
                                class="w-100"
                                @click="router.push('/register')"
                            >
                                {{ t('home.buttons.register') }}
                            </BaseButton>

                        </template>

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
