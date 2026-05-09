<script setup lang="ts">

import {computed, watch} from 'vue'
import {useRoute} from 'vue-router'

import {useCarStore} from '~/stores/car'
import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'
import {useUiStore} from '~/stores/ui'
import BaseButton from "../../components/BaseButton.vue";

const store = useCarStore()
const auth = useAuthStore()
const cart = useCartStore()
const ui = useUiStore()

const route = useRoute()

watch(
    () => route.query.page,
    async (page) => {
        const currentPage = Number(page) || 1

        try {
            ui.showLoader('Загрузка...')
            await store.fetch(currentPage)
        } finally {
            ui.hideLoader()
        }
    },
    {immediate: true}
)

const changePage = (page: number) => {
    navigateTo({
        path: '/cars',
        query: {page}
    })
}

const openCar = (id: number) => {
    navigateTo(`/cars/show/${id}`)
}

const getImage = (car: any) => {
    return car.photo_url || '/images/default_car.jpg'
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

const addToCart = (car: any) => {
    cart.add({
        id: car.id,
        name: car.title,
        price: car.price,
        qty: 1,
        photo_url: car.photo_url
    })
}

const isInCart = (carId: number) => {
    return Object.values(cart.items || {}).some(
        (item: any) => item?.id === carId
    )
}

const isFirstPage = computed(() => {
    return !store.meta || store.meta.current_page <= 1
})

const isLastPage = computed(() => {
    return !store.meta || store.meta.current_page >= store.meta.last_page
})

const pages = computed(() => {
    if (!store.meta) return []
    return Array.from({length: store.meta.last_page}, (_, i) => i + 1)
})

</script>

<template>
    <div class="container mt-4">

        <h1 class="mb-3">Каталог</h1>

        <!-- top pagination -->
        <div
            v-if="store.meta"
            class="d-flex gap-2 mb-3 align-items-center flex-wrap"
        >
            <BaseButton
                :variant="isFirstPage ? 'outline-primary' : 'primary'"
                :disabled="isFirstPage || store.loading"
                @click="changePage(store.meta.current_page - 1)"
            >
                Назад
            </BaseButton>

            <BaseButton
                v-for="p in pages"
                :key="p"
                :variant="p === store.meta.current_page ? 'primary' : 'outline-primary'"
                :disabled="store.loading"
                @click="changePage(p)"
            >
                {{ p }}
            </BaseButton>

            <BaseButton
                :variant="isLastPage ? 'outline-primary' : 'primary'"
                :disabled="isLastPage || store.loading"
                @click="changePage(store.meta.current_page + 1)"
            >
                Вперёд
            </BaseButton>
        </div>

        <!-- cars list -->
        <div class="row">
            <div
                v-for="car in store.cars"
                :key="car.id"
                class="col-4 mb-3"
            >
                <div
                    class="card car-card"
                    :class="{ loading: store.loading }"
                    @click="openCar(car.id)"
                >
                    <img
                        :src="getImage(car)"
                        class="card-img-top"
                        style="height: 200px; object-fit: contain;"
                        alt=""
                    >

                    <div class="card-body">
                        <h5>{{ car.title }}</h5>

                        <p v-if="auth.user">
                            {{ formatPrice(car.price) }}
                        </p>

                        <p v-else class="text-muted">
                            Авторизуйтесь, чтобы увидеть цену
                        </p>
                    </div>

                    <div v-if="auth.user" class="p-3 pt-0">
                        <BaseButton
                            v-if="isInCart(car.id)"
                            variant="light"
                            class="w-100"
                            @click.stop="navigateTo('/cart')"
                        >
                            Товар в корзине
                        </BaseButton>

                        <BaseButton
                            v-else
                            variant="success"
                            class="w-100"
                            @click.stop="addToCart(car)"
                        >
                            В корзину
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- bottom pagination -->
        <div
            v-if="store.meta"
            class="d-flex gap-2 mt-3 align-items-center flex-wrap"
        >
            <BaseButton
                :variant="isFirstPage ? 'outline-primary' : 'primary'"
                :disabled="isFirstPage || store.loading"
                @click="changePage(store.meta.current_page - 1)"
            >
                Назад
            </BaseButton>

            <BaseButton
                v-for="p in pages"
                :key="p"
                :variant="p === store.meta.current_page ? 'primary' : 'outline-primary'"
                :disabled="store.loading"
                @click="changePage(p)"
            >
                {{ p }}
            </BaseButton>

            <BaseButton
                :variant="isLastPage ? 'outline-primary' : 'primary'"
                :disabled="isLastPage || store.loading"
                @click="changePage(store.meta.current_page + 1)"
            >
                Вперёд
            </BaseButton>
        </div>

        <!-- meta info -->
        <div v-if="store.meta" class="mt-2 text-muted small">
            Страница {{ store.meta.current_page }} / {{ store.meta.last_page }}
            · Показано {{ store.meta.from }}–{{ store.meta.to }}
            из {{ store.meta.total }}
        </div>

    </div>
</template>
