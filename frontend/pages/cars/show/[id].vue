<script setup lang="ts">

import {computed, ref, watch} from 'vue'

import {useCarStore} from '~/stores/car'
import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

import AuthModal from '~/components/modals/AuthModal.vue'
import BaseButton from '~/components/BaseButton.vue'

const route = useRoute()

const store = useCarStore()
const auth = useAuthStore()
const cart = useCartStore()

const showAuth = ref(false)
const addingToCart = ref<number | null>(null)
const showImage = ref(false)

const openAuthModal = () => {
    showAuth.value = true
}

const car = computed(() => store.car)

const carImage = computed(() => {
    return car.value?.photo_url || '/images/default_car.jpg'
})

const formatPrice = (price?: number | null) =>
    new Intl.NumberFormat('ru-RU').format(price ?? 0) + ' ₽'

const isInCart = (carId: number) => {
    return Object.values(cart.items || {}).some(
        (item: any) => Number(item?.id) === Number(carId)
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

const openImage = () => {
    showImage.value = true
}

const closeImage = () => {
    showImage.value = false
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

        <div v-if="store.carLoading" class="alert alert-light mb-3">
            Загрузка автомобиля...
        </div>

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
                        <div class="car-image-wrapper">
                            <img
                                :src="carImage"
                                class="img-fluid rounded car-image"
                                style="max-height:400px;object-fit:contain;"
                                alt=""
                                @click="openImage"
                            >
                        </div>
                        <!-- IMAGE MODAL -->
                        <div
                            v-if="showImage"
                            class="image-modal"
                            @click="closeImage"
                        >
                            <img
                                :src="carImage"
                                class="image-full"
                                @click.stop
                                alt=""
                            >
                        </div>
                    </div>

                    <div class="col-md-7">

                        <div class="table-responsive mb-3">
                            <table class="table table-sm align-middle mb-0 description-table">
                                <tbody>
                                <tr v-if="car.description">
                                    <td class="text-muted fw-semibold w-25">Описание</td>
                                    <td>{{ car.description }}</td>
                                </tr>

                                <tr v-if="car.options?.brand">
                                    <td class="text-muted fw-semibold">Бренд</td>
                                    <td>{{ car.options.brand }}</td>
                                </tr>

                                <tr v-if="car.options?.model">
                                    <td class="text-muted fw-semibold">Модель</td>
                                    <td>{{ car.options.model }}</td>
                                </tr>

                                <tr v-if="car.options?.year">
                                    <td class="text-muted fw-semibold">Год</td>
                                    <td>{{ car.options.year }}</td>
                                </tr>

                                <tr v-if="car.options?.mileage">
                                    <td class="text-muted fw-semibold">Пробег</td>
                                    <td>{{ car.options.mileage }}</td>
                                </tr>

                                <tr v-if="auth.user && car.price">
                                    <td class="text-muted fw-semibold">Цена</td>
                                    <td>{{ formatPrice(car.price) }}</td>
                                </tr>

                                <tr v-else>
                                    <td class="text-muted fw-semibold">Цена</td>
                                    <td>
                                        <button
                                            class="btn btn-light"
                                            @click="openAuthModal"
                                        >
                                            Авторизуйтесь, чтобы увидеть цену
                                        </button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <AuthModal v-model="showAuth"/>

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

<style scoped>

.car-image-wrapper {
    display: inline-block;
    overflow: hidden;
}

.car-image {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.car-image:hover {
    transform: scale(1.05);
}

.image-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.image-full {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    cursor: zoom-out;
}

.description-table tr {
    border-bottom: 1px solid #e9ecef;
}

.description-table tr:last-child {
    border-bottom: none;
    border-color: transparent;
}

.description-table td {
    padding: 10px 12px;
}

</style>
