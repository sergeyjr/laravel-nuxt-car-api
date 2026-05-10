<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import { useRoute, navigateTo } from '#app'

import { useCarStore } from '~/stores/car'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

import AuthModal from '~/components/modals/AuthModal.vue'
import BaseButton from '~/components/BaseButton.vue'

const route = useRoute()

const store = useCarStore()
const auth = useAuthStore()
const cart = useCartStore()

const showAuth = ref(false)
const addingToCart = ref<number | null>(null)

const car = computed(() => store.car)

const carImage = computed(() => {
    return car.value?.photo_url || '/images/default_car.jpg'
})

const formatPrice = (price?: number | null) =>
    new Intl.NumberFormat('ru-RU').format(price ?? 0) + ' ₽'

const isInCart = (carId: number) => {
    return Object.values(cart.items || {}).some(
        (item: any) => item?.id === carId
    )
}

const addToCart = async (car: any) => {
    const id = Number(car?.id)
    if (!id) return

    try {
        addingToCart.value = id

        await cart.add({
            id,
            name: car.title ?? '',
            price: car.price ?? 0,
            qty: 1,
            photo_url: car.photo_url ?? null,
        })

    } finally {
        addingToCart.value = null
    }
}

watch(
    () => route.params.id,
    async (id) => {
        if (!id || Array.isArray(id)) return
        await store.fetchCar(Number(id))
    },
    { immediate: true }
)

</script>

<template>
    <div class="container mt-4">

        <div v-if="store.carPending && !car" class="alert alert-light d-flex align-items-center gap-2">
            <span>Загружаем автомобиль...</span>
        </div>

        <div v-else-if="!store.carPending && !car">
            Автомобиль не найден
        </div>

        <template v-else>

            <div class="position-relative">

                <div v-if="store.carLoading" class="alert alert-light mb-3 d-flex align-items-center gap-2">
                    <span class="spinner-border spinner-border-sm"></span>
                    <span>Загрузка...</span>
                </div>

                <div class="row">

                    <div class="col-12">
                        <h1 class="mb-4">{{ car?.title }}</h1>
                    </div>

                    <div class="col-md-5">
                        <img
                            :src="carImage"
                            class="img-fluid rounded"
                            style="max-height:400px;object-fit:contain;"
                            alt=""
                        >
                    </div>

                    <div class="col-md-7">

                        <p>
                            <span class="fw-bold">Описание:</span>
                            {{ car?.description }}
                        </p>

                        <div v-if="car?.option">
                            <p><span class="fw-bold">Бренд:</span> {{ car.option.brand }}</p>
                            <p><span class="fw-bold">Модель:</span> {{ car.option.model }}</p>
                            <p><span class="fw-bold">Год:</span> {{ car.option.year }}</p>
                            <p><span class="fw-bold">Пробег:</span> {{ car.option.mileage }}</p>

                            <p v-if="auth.user">
                                <span class="fw-bold">Цена:</span>
                                {{ formatPrice(car.price) }}
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
                                v-if="car && isInCart(car.id)"
                                variant="light"
                                class="w-100"
                                @click="navigateTo('/cart')"
                            >
                                Товар в корзине
                            </BaseButton>

                            <BaseButton
                                v-else
                                variant="success"
                                class="w-100"
                                :disabled="addingToCart === car?.id"
                                @click="car && addToCart(car)"
                            >
                                <span v-if="addingToCart === car?.id">
                                    Добавляется...
                                </span>
                                <span v-else>
                                    В корзину
                                </span>
                            </BaseButton>

                        </div>

                    </div>

                </div>

                <hr>

                <NuxtLink to="/cars" class="btn btn-secondary">
                    В каталог
                </NuxtLink>

            </div>

        </template>

    </div>
</template>
