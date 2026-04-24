<script setup>

import {computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useCarStore} from '@/stores/carStore'

const route = useRoute()
const router = useRouter()
const carStore = useCarStore()

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

const goBack = () => {
    router.push('/cars')
}

</script>

<template>
    <div class="container mt-4">

        <!-- LOADING -->
        <div v-if="loading">Загрузка...</div>

        <!-- NOT FOUND -->
        <div v-else-if="!car">
            Автомобиль не найден
        </div>

        <!-- CONTENT -->
        <template v-else>

            <div class="row">

                <!-- IMAGE -->
                <div class="col-md-5">
                    <img
                        :src="carImage"
                        class="img-fluid rounded"
                        style="max-height: 400px; object-fit: contain;"
                        alt="">
                </div>

                <!-- INFO -->
                <div class="col-md-7">

                    <h2 class="mb-4">{{ car.title }}</h2>

                    <p><strong>Цена:</strong> {{ formatPrice(car.price) }}</p>
                    <p><strong>Описание:</strong> {{ car.description }}</p>

                    <div v-if="car.option">
                        <p><strong>Бренд:</strong> {{ car.option.brand }}</p>
                        <p><strong>Модель:</strong> {{ car.option.model }}</p>
                        <p><strong>Год:</strong> {{ car.option.year }}</p>
                        <p><strong>Пробег:</strong> {{ car.option.mileage }}</p>
                    </div>

                </div>

            </div>

            <hr>

            <button
                class="btn btn-secondary mt-3"
                @click="goBack"
            >
                Назад
            </button>

        </template>

    </div>
</template>
