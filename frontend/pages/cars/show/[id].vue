<script setup>

import {computed, watch} from 'vue'
import {useRoute, navigateTo} from '#app'
import {useCarStore} from '~/stores/car'
import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'
import AuthModal from '~/components/modals/AuthModal.vue'

const showAuth = ref(false)

const route = useRoute()

const store = useCarStore()
const auth = useAuthStore()
const cart = useCartStore()

const carId = computed(() => {
    const id = route.params.id
    return Array.isArray(id) ? null : Number(id)
})

if (!carId.value) {
    await navigateTo('/404')
} else {
    await store.fetchCar(carId.value)

    if (!store.car) {
        await navigateTo('/404')
    } else {
        if (auth.isAuth && !Object.keys(cart.items || {}).length) {
            await cart.fetch()
        }
    }
}

const car = computed(() => store.car)
const loading = computed(() => store.carLoading)

const carImage = computed(() => {
    if (!car.value?.photo_url) return '/images/default_car.jpg'
    return car.value.photo_url
})

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

watch(
    () => route.params.id,
    async (id) => {
        if (!id || Array.isArray(id)) return

        await store.fetchCar(Number(id))
    },
    {immediate: true}
)

</script>

<template>
    <div class="container mt-4">

        <div v-if="loading">Загрузка...</div>

        <div v-else-if="!car">
            Автомобиль не найден
        </div>

        <template v-else>

            <div class="row">

                <div class="col-12">
                    <h1 class="mb-4">{{ car.title }}</h1>
                </div>

                <div class="col-md-5">
                    <img
                        :src="carImage"
                        class="img-fluid rounded"
                        style="max-height:400px;object-fit:contain;"
                        alt="">
                </div>

                <div class="col-md-7">

                    <p><strong>Описание:</strong> {{ car.description }}</p>

                    <div v-if="car.option">
                        <p><strong>Бренд:</strong> {{ car.option.brand }}</p>
                        <p><strong>Модель:</strong> {{ car.option.model }}</p>
                        <p><strong>Год:</strong> {{ car.option.year }}</p>
                        <p><strong>Пробег:</strong> {{ car.option.mileage }}</p>

                        <p v-if="auth.user">
                            <strong>Цена:</strong> {{ formatPrice(car.price) }}
                        </p>

                        <p v-else class="text-muted">
                            <button class="btn btn-light" @click="showAuth = true">
                                Авторизуйтесь, чтобы увидеть цену
                            </button>

                            <AuthModal v-model="showAuth" />
                        </p>
                    </div>

                    <div v-if="auth.user">

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

            <hr>

            <NuxtLink to="/cars" class="btn btn-outline-secondary">
                В каталог
            </NuxtLink>

        </template>

    </div>
</template>
