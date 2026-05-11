<script setup lang="ts">

import {computed, ref, watch} from 'vue'

import {useCarStore} from '~/stores/car'
import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'
import {useUiStore} from '~/stores/ui'

import AuthModal from '~/components/modals/AuthModal.vue'
import BaseButton from '~/components/BaseButton.vue'

const route = useRoute()

const store = useCarStore()
const auth = useAuthStore()
const cart = useCartStore()
const ui = useUiStore()

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

        try {
            ui.showLoader('Загрузка автомобиля...')
            await store.fetchCar(Number(id))
        } finally {
            ui.hideLoader()
        }
    },
    {immediate: true}
)

</script>

<template>
    <div class="container mt-4">

        <div v-if="!store.carLoading && !car">
            Автомобиль не найден
        </div>

        <template v-else-if="car">

            <div class="position-relative">

                <div class="row">

                    <div class="col-12">
                        <h1 class="mb-4">{{ car.title }}</h1>
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
                            {{ car.description }}
                        </p>

                        <div v-if="car.options">
                            <p>
                                <span class="fw-bold">Бренд:</span>
                                {{ car.options.brand }}
                            </p>

                            <p>
                                <span class="fw-bold">Модель:</span>
                                {{ car.options.model }}
                            </p>

                            <p>
                                <span class="fw-bold">Год:</span>
                                {{ car.options.year }}
                            </p>

                            <p>
                                <span class="fw-bold">Пробег:</span>
                                {{ car.options.mileage }}
                            </p>

                            <p v-if="auth.user">
                                <span class="fw-bold">Цена:</span>
                                {{ formatPrice(car.price) }}
                            </p>

                            <p v-else class="text-muted">
                                <button
                                    class="btn btn-light"
                                    @click="showAuth = true"
                                >
                                    Авторизуйтесь, чтобы увидеть цену
                                </button>

                                <AuthModal v-model="showAuth"/>
                            </p>
                        </div>

                        <div v-if="auth.user">

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
                                :disabled="addingToCart === car.id"
                                @click="addToCart(car)"
                            >
                                <span v-if="addingToCart === car.id">
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
