<script setup>

import {computed} from 'vue'
import {useCarStore} from '~/stores/car'
import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

const store = useCarStore()
const auth = useAuthStore()
const cart = useCartStore()

await callOnce(async () => {
    await store.fetch(1)

    if (auth.isAuth && !Object.keys(cart.items || {}).length) {
        await cart.fetch()
    }
})

const changePage = (p) => {
    navigateTo(`/cars?page=${p}`)
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

</script>

<template>
    <div class="container mt-4">

        <h1>Каталог</h1>

        <div v-if="store.loading">Загрузка...</div>

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
                        style="height:200px;object-fit:contain;"
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

        <!-- pagination -->
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

        <div v-if="store.meta" class="mt-2">
            Страница: {{ store.meta.current_page }} / {{ store.meta.last_page }}
            <br>
            Показано {{ store.meta.from }}–{{ store.meta.to }}
            из {{ store.meta.total }}
        </div>

    </div>
</template>
