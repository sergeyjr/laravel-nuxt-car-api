<script setup>

import {computed} from 'vue'
import {useCarStore} from '~/stores/car'
import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'
import {useRoute} from 'vue-router'
import {watch} from 'vue'

const store = useCarStore()
const auth = useAuthStore()
const cart = useCartStore()

const route = useRoute()

watch(
    () => route.query.page,
    (page) => {
        const p = Number(page) || 1
        store.fetch(p)
    },
    {immediate: true}
)

const changePage = (p) => {
    navigateTo({
        path: '/cars',
        query: {page: p}
    })
}

const openCar = (id) => navigateTo(`/cars/show/${id}`)

const getImage = (car) => {
    if (!car.photo_url) return '/images/default_car.jpg'
    return car.photo_url
}

const formatPrice = (price) =>
    new Intl.NumberFormat('ru-RU').format(price) + ' ₽'

const addToCart = (car) => {
    cart.add({
        id: car.id,
        name: car.title,
        price: car.price,
        qty: 1,
        photo_url: car.photo_url
    })
}

const isInCart = (carId) => {
    return Object.values(cart.items || {}).some(
        item => item?.id === carId
    )
}

/* pagination states */
const isFirstPage = computed(() =>
    !store.meta || store.meta.current_page <= 1
)

const isLastPage = computed(() =>
    !store.meta || store.meta.current_page >= store.meta.last_page
)

/* список страниц */
const pages = computed(() => {
    if (!store.meta) return []
    return Array.from({length: store.meta.last_page}, (_, i) => i + 1)
})

</script>

<template>
    <div class="container mt-4">

        <h1 class="mb-3">Каталог</h1>

        <div v-if="store.loading" class="loading-bar mb-3">
            Загрузка данных...
        </div>

        <!-- pagination TOP -->
        <div v-if="store.meta" class="d-flex gap-2 mb-3 align-items-center flex-wrap">

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

        <!-- cars -->
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

                    <!-- shimmer -->
                    <div v-if="store.loading" class="shimmer"></div>

                    <img
                        :src="getImage(car)"
                        class="card-img-top"
                        style="height:200px;object-fit:contain;"
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

        <!-- pagination BOTTOM -->
        <div v-if="store.meta" class="d-flex gap-2 mt-3 align-items-center flex-wrap">

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

        <div v-if="store.meta" class="mt-2 text-muted small">
            Страница {{ store.meta.current_page }} / {{ store.meta.last_page }}
            · Показано {{ store.meta.from }}–{{ store.meta.to }}
            из {{ store.meta.total }}
        </div>

    </div>
</template>

<style scoped>

.loading-bar {
    display: flex;
    align-items: center;
    gap: 8px;

    padding: 10px 14px;
    border-radius: 8px;

    background: rgba(13, 110, 253, 0.08);
    border: 1px solid rgba(13, 110, 253, 0.2);

    color: #0d6efd;
    font-weight: 500;
}

.car-card {
    position: relative;
    cursor: pointer;
    min-height: 320px;
}

.car-card.loading {
    filter: grayscale(1);
    opacity: 0.75;
    pointer-events: none;
}

.shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        110deg,
        rgba(255, 255, 255, 0.05) 25%,
        rgba(255, 255, 255, 0.35) 50%,
        rgba(255, 255, 255, 0.05) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    z-index: 2;
    border-radius: 6px;
}

@keyframes shimmer {
    from {
        background-position: -200% 0;
    }
    to {
        background-position: 200% 0;
    }
}

</style>
