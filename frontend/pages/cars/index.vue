<script setup lang="ts">

import {computed, onMounted, ref} from 'vue'

import {useCarStore} from '~/stores/car'
import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

import BaseButton from '~/components/BaseButton.vue'
import Pagination from '~/components/Pagination.vue'

const store = useCarStore()
const auth = useAuthStore()
const cart = useCartStore()

const route = useRoute()

const clientReady = ref(false)

onMounted(() => {
    clientReady.value = true
})

const page = computed(() => Number(route.query.page || 1))

watch(
    page,
    async (newPage) => {
        await store.fetch(newPage)
    },
    { immediate: true }
)

const changePage = (page: number) => {
    navigateTo({
        path: '/cars',
        query: {page}
    })
}

const getImage = (car: any) => car.photo_url || '/images/default_car.jpg'

const formatPrice = (price?: number | null) =>
    new Intl.NumberFormat('ru-RU').format(price ?? 0) + ' ₽'

const addToCart = (car: any) => {
    cart.add({
        id: car.id,
        name: car.title,
        price: car.price,
        qty: 1,
        photo_url: car.photo_url
    })
}

const isInCart = (carId: number | string) => {
    return !!cart.items[String(carId)]
}

</script>

<template>
    <div class="container mt-4">

        <h1 class="mb-4">Каталог</h1>

        <!-- pagination top -->
        <div
            v-if="store.meta"
            class="d-flex gap-2 mb-3 align-items-center flex-wrap"
        >
            <Pagination
                :meta="store.meta"
                :loading="store.listLoading"
                @change="changePage"
            />
        </div>

        <div v-if="store.listLoading" class="alert alert-light mb-3">
            Загрузка каталога...
        </div>

        <!-- cars -->
        <div class="row">

            <div
                v-for="car in store.cars"
                :key="car.id"
                class="col-4 mb-3"
            >
                <div class="card car-card text-center">

                    <NuxtLink
                        :to="`/cars/show/${car.id}`"
                        class="text-decoration-none text-dark"
                    >
                        <img
                            :src="getImage(car)"
                            class="card-img-top"
                            style="height: 200px; object-fit: contain;"
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
                    </NuxtLink>

                    <div v-if="auth.user" class="p-3 pt-0">

                        <div v-if="!clientReady" class="w-100 btn btn-light disabled">
                            Проверка корзины...
                        </div>

                        <template v-else>
                            <BaseButton
                                v-if="isInCart(car.id)"
                                variant="light"
                                class="w-100"
                                disabled
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
                        </template>

                    </div>

                </div>
            </div>

        </div>

        <!-- pagination bottom -->
        <div
            v-if="store.meta"
            class="d-flex gap-2 mb-3 align-items-center flex-wrap"
        >
            <Pagination
                :meta="store.meta"
                :loading="store.listLoading"
                @change="changePage"
            />
        </div>

        <!-- meta -->
        <div v-if="store.meta" class="mt-2 text-muted small">
            Страница {{ store.meta.current_page }} / {{ store.meta.last_page }}
            · Показано {{ store.meta.from }}–{{ store.meta.to }}
            из {{ store.meta.total }}
        </div>

    </div>
</template>
