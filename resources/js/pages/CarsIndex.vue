<script setup>

import {onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useCarStore} from '@/stores/carStore'
import {useAuthStore} from '@/stores/authStore'

import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const store = useCarStore()

onMounted(() => {
    store.fetch(1)
})

const changePage = (page) => {
    store.fetch(page)
}

const openCar = (id) => {
    router.push(`/cars/show/${id}`)
}

const getImage = (car) => {
    if (!car.photo_url) {
        return '/images/default_car.jpg'
    }
    if (car.photo_url.startsWith('http')) {
        return car.photo_url
    }
    return `${car.photo_url}`
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

const auth = useAuthStore()

</script>

<template>
    <div class="container mt-4">

        <h1>Каталог</h1>

        <!-- LOADING -->
        <div v-if="store.loading">Загрузка...</div>

        <!-- GRID -->
        <div v-else class="row">
            <div
                v-for="car in store.cars"
                :key="car.id"
                class="col-4 mb-3"
            >
                <div
                    class="card"
                    @click="openCar(car.id)"
                    style="cursor:pointer"
                >

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
            </div>
        </div>

        <!-- PAGINATION -->
        <div v-if="store.meta" class="d-flex gap-2 mt-3">

            <BaseButton
                variant="secondary"
                :disabled="store.meta.current_page <= 1"
                @click="changePage(store.meta.current_page - 1)"
            >
                Назад
            </BaseButton>

            <BaseButton
                variant="primary"
                :disabled="store.meta.current_page >= store.meta.last_page"
                @click="changePage(store.meta.current_page + 1)"
            >
                Вперёд
            </BaseButton>

        </div>

        <!-- META -->
        <div v-if="store.meta" class="mt-2">
            Страница: {{ store.meta.current_page }} / {{ store.meta.last_page }}
            <br>
            Показано {{ store.meta.from }}–{{ store.meta.to }}
            из {{ store.meta.total }} автомобилей
        </div>

    </div>
</template>
