<script setup>

import {ref, onMounted} from 'vue'
import axios from 'axios'
import {useAuthStore} from '@/stores/authStore'
import {useRouter} from 'vue-router'
import {useAuthActions} from '@/composables/useAuthActions'
import ContactMiniForm from '@/components/ContactMiniForm.vue'
import BaseButton from '@/components/BaseButton.vue'

import {Swiper, SwiperSlide} from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import {useSwiper} from '@/composables/useSwiper'

const {swiperOptions} = useSwiper()

const latestCars = ref([])
const loadingCars = ref(false)

onMounted(async () => {
    try {
        loadingCars.value = true
        const res = await axios.get('/api/cars/latest')
        latestCars.value = res.data.data ?? res.data
    } catch (e) {
        console.error(e)
    } finally {
        loadingCars.value = false
    }
})

const getImage = (car) => {
    if (!car.photo_url) return '/images/default_car.jpg'
    if (car.photo_url.startsWith('http')) return car.photo_url
    return car.photo_url
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

const openCar = (id) => {
    router.push(`/cars/show/${id}`)
}

const auth = useAuthStore()
const router = useRouter()

const {handleLogout} = useAuthActions()

</script>

<template>
    <div class="container my-4">

        <div class="text-center mb-5">
            <h1 class="display-5 fw-bold">Главная страница</h1>
            <p class="text-muted">Простой Laravel + Vue проект</p>
        </div>

        <div class="row g-4">

            <!-- STATUS -->
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h4 class="card-title">Статус пользователя</h4>

                        <div v-if="auth.isAuth">
                            <p class="text-success mb-0">Вы авторизованы</p>
                            <small class="text-muted">Добро пожаловать!</small>
                        </div>

                        <div v-else>
                            <p class="text-warning mb-0">Вы гость</p>
                            <small class="text-muted">
                                Войдите, чтобы получить доступ ко всем функциям
                            </small>
                        </div>

                    </div>
                </div>
            </div>

            <!-- ACTIONS -->
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h4 class="card-title">Быстрые действия</h4>

                        <template v-if="auth.isAuth">

                            <BaseButton
                                variant="primary"
                                class="w-100 mb-2"
                                @click="router.push('/dashboard/profile')"
                            >
                                Профиль
                            </BaseButton>

                            <BaseButton
                                variant="danger"
                                class="w-100"
                                :loading="auth.loading"
                                @click="handleLogout"
                            >
                                <template #loading>
                                    Выход...
                                </template>
                                Выйти
                            </BaseButton>

                        </template>

                        <template v-else>

                            <BaseButton
                                variant="primary"
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

            <div class="col-12 mt-5">
                <h2 class="mb-4">Новинки</h2>

                <div v-if="loadingCars">
                    Загрузка новинок...
                </div>

                <div v-else>

                    <Swiper v-bind="swiperOptions" class="swiper-custom">

                        <SwiperSlide v-for="car in latestCars" :key="car.id">
                            <div class="card h-100" style="cursor:pointer" @click="openCar(car.id)">
                                <img
                                    :src="getImage(car)"
                                    class="card-img-top"
                                    style="height:200px; object-fit:contain;"
                                    alt="">

                                <div class="card-body">
                                    <h5>{{ car.title }}</h5>

                                    <p v-if="auth.user">
                                        {{ formatPrice(car.price) }}
                                    </p>

                                    <p v-else class="text-muted">
                                        Авторизуйтесь, чтобы увидеть цену
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>

                    </Swiper>

                </div>
            </div>

            <ContactMiniForm />

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
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    will-change: transform;
}

.swiper-custom :deep(.swiper-slide):hover .card {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.18);
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
