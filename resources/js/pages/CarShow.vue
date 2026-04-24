<script setup>

import {computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useCarStore} from '@/stores/carStore'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const carStore = useCarStore()
const auth = useAuthStore()

onMounted(() => {
    carStore.fetchCar(route.params.id)
})

const car = computed(() => carStore.car)
const loading = computed(() => carStore.carLoading)

const carImage = computed(() => {
    if (!car.value?.photo_url) {
        return '/images/default_car.jpg'
    }
    if (car.value.photo_url.startsWith('http')) {
        return car.value.photo_url
    }
    return `${car.value.photo_url}`
})

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

</script>

<template>
    <div class="container mt-4">

        <div v-if="loading">Загрузка...</div>

        <div v-else-if="!car">
            Автомобиль не найден
        </div>

        <template v-else>

            <div class="row">

                <div class="col-md-5">
                    <img
                        :src="carImage"
                        class="img-fluid rounded"
                        style="max-height: 400px; object-fit: contain;"
                        alt="">
                </div>

                <div class="col-md-7">

                    <h2 class="mb-4">{{ car.title }}</h2>

                    <p><strong>Описание:</strong> {{ car.description }}</p>

                    <div v-if="car.option">
                        <p><strong>Бренд:</strong> {{ car.option.brand }}</p>
                        <p><strong>Модель:</strong> {{ car.option.model }}</p>
                        <p><strong>Год:</strong> {{ car.option.year }}</p>
                        <p><strong>Пробег:</strong> {{ car.option.mileage }}</p>
                    </div>

                        <p v-if="auth.user">
                            {{ formatPrice(car.price) }}
                        </p>

                        <p v-else class="text-muted">
                            Авторизуйтесь, чтобы увидеть цену
                        </p>

                </div>

            </div>

            <hr>

            <router-link to="/cars" class="btn btn-outline-secondary">
                В каталог
            </router-link>

        </template>

    </div>
</template>
