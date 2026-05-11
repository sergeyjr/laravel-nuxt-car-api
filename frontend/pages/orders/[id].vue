<script setup lang="ts">

import {computed} from 'vue'

import {useOrderStore} from '~/stores/order'
import {useOrderStatus} from '~/composables/useOrderStatus'

const route = useRoute()
const store = useOrderStore()
const {getLabel} = useOrderStatus()

const orderId = computed(() => route.params.id)

const load = async (id: string | number) => {
    if (!id) {
        throw createError({
            statusCode: 404,
            statusMessage: 'ID заказа отсутствует.'
        })
    }

    try {
        const res = await store.fetchOrder(id)

        // если API вернул null/undefined → показываем 404 Nuxt way
        if (!res || !store.currentOrder) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Заказ не найден.'
            })
        }

    } catch (e) {
        showError({
            statusCode: 404,
            statusMessage: 'Заказ не найден.'
        })
    }
}

await useAsyncData(
    () => `order-${orderId.value}`,
    () => load(orderId.value),
    {
        watch: [orderId]
    }
)

const order = computed(() => store.currentOrder)

const goBack = () => {
    if (import.meta.client && window.history.length > 1) {
        window.history.back()
    } else {
        navigateTo('/dashboard')
    }
}

</script>

<template>
    <div class="container mt-4">

        <div v-if="!order">
            Загрузка...
        </div>

        <div v-else>

            <h2>Заказ #{{ order.id }}</h2>

            <p class="text-muted">
                Статус: <span class="fw-bold">{{ getLabel(order.status) }}</span>
            </p>

            <hr>

            <div class="row g-3">

                <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="col-12"
                >
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-3">

                        <!-- LEFT -->
                        <div class="d-flex align-items-center gap-3">

                            <NuxtLink :to="`/cars/show/${item.car_id}`">
                                <img
                                    :src="item.photo_url || '/images/default_car.jpg'"
                                    style="width:90px;height:60px;object-fit:contain;border-radius:6px;"
                                    alt=""/>
                            </NuxtLink>

                            <div>
                                <span class="fw-bold">
                                    {{ item.name || ('Машина #' + item.car_id) }}
                                </span>

                                <div class="text-muted small">
                                    {{ item.qty }} × {{ item.price }} ₽
                                </div>
                            </div>

                        </div>

                        <!-- RIGHT -->
                        <div class="fw-bold">
                            {{ item.qty * item.price }} ₽
                        </div>

                    </div>
                </div>

            </div>

            <h4 class="text-success mt-3">
                Итого: {{ order.total }} ₽
            </h4>

            <hr>

            <button class="btn btn-outline-secondary" @click="goBack">
                Назад
            </button>

        </div>

    </div>
</template>
