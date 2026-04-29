<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useAuthActions } from '@/composables/useAuthActions'
import { useCarStore } from '@/stores/car'
import { useContactStore } from '@/stores/contact'

import BaseButton from '@/components/BaseButton.vue'

// --- router (Nuxt 4 OK) ---
const router = useRouter()

// --- AUTH ---
const auth = useAuthStore()
const { handleLogout } = useAuthActions()

const user = computed(() => auth.user)

// --- CARS ---
const carStore = useCarStore()

onMounted(() => {
    carStore.fetchLatest()
})

// --- utils ---
const getImage = (car) => {
    if (!car.photo_url) return '/images/default_car.jpg'
    return car.photo_url
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

const openCar = (id) => {
    router.push(`/cars/show/${id}`)
}

// --- CONTACT ---
const contactStore = useContactStore()

// --- SWIPER ---
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const modules = [Navigation, Pagination]

const swiperOptions = {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 20,
    navigation: true,
    pagination: { clickable: true },
    loop: true,
    speed: 600,
    breakpoints: {
        320: { slidesPerView: 1, slidesPerGroup: 1 },
        768: { slidesPerView: 2, slidesPerGroup: 2 },
        1024: { slidesPerView: 3, slidesPerGroup: 3 }
    }
}
</script>

<template>
    <div class="container my-4">

        <!-- HEADER -->
        <div class="text-center mb-5">
            <h1 class="display-5 fw-bold">Главная страница</h1>
            <p class="text-muted">Nuxt 4 + Laravel API</p>
        </div>

        <div class="row g-4">

            <!-- USER STATUS -->
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h4>Статус пользователя</h4>

                        <div v-if="auth.isAuth">
                            <p class="text-muted">Добро пожаловать, {{ user?.name }}</p>
                            <p class="text-success mb-0">Вы авторизованы</p>
                        </div>

                        <div v-else>
                            <p class="text-warning mb-0">Вы гость</p>
                            <small class="text-muted">
                                Войдите или зарегистрируйтесь
                            </small>
                        </div>

                    </div>
                </div>
            </div>

            <!-- QUICK ACTIONS -->
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h4>Быстрые действия</h4>

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
                                <template #loading>Выход...</template>
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

            <!-- LATEST -->
            <div class="col-12 mt-5">
                <h2 class="mb-4">Новинки</h2>

                <div v-if="carStore.latestLoading">
                    Загрузка новинок...
                </div>

                <Swiper
                    v-else
                    :modules="modules"
                    v-bind="swiperOptions"
                    class="swiper-custom"
                >
                    <SwiperSlide
                        v-for="car in carStore.latest"
                        :key="car.id"
                    >
                        <div class="card h-100" @click="openCar(car.id)">
                            <img
                                :src="getImage(car)"
                                class="card-img-top"
                                style="height:200px; object-fit:contain;"
                            />

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

            <!-- CONTACT -->
            <div class="col-6 offset-3 mt-5">

                <h4 class="mb-3">Связаться с нами</h4>

                <div v-if="contactStore.contexts.home.successMessage" class="alert alert-success">
                    {{ contactStore.contexts.home.successMessage }}
                </div>

                <div v-if="contactStore.contexts.home.errorMessage" class="alert alert-danger">
                    {{ contactStore.contexts.home.errorMessage }}
                </div>

                <div v-if="contactStore.retryAfter" class="alert alert-warning">
                    Подождите {{ contactStore.retryAfter }} сек
                </div>

                <form @submit.prevent="contactStore.submit">

                    <input v-model="contactStore.form.name" class="form-control mb-2" placeholder="Имя" />
                    <input v-model="contactStore.form.email" class="form-control mb-2" placeholder="Email" />
                    <input v-model="contactStore.form.subject" class="form-control mb-2" placeholder="Тема" />
                    <textarea v-model="contactStore.form.body" class="form-control mb-2" rows="5"></textarea>

                    <BaseButton
                        variant="primary"
                        type="submit"
                        class="w-100"
                        :loading="contactStore.loading"
                        :disabled="contactStore.retryAfter > 0"
                    >
                        Отправить
                    </BaseButton>

                </form>

            </div>

        </div>
    </div>
</template>

<style scoped>
.swiper-custom {
    padding: 20px 0 40px 0;
}

.swiper-custom :deep(.card-img-top) {
    height: 200px;
    object-fit: contain;
}
</style>
