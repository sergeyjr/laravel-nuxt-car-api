<script setup lang="ts">

import {computed} from 'vue'

import {useRoute} from 'vue-router'

import {useOrderStore} from '~/stores/order'

import {useOrderStatus} from '~/composables/useOrderStatus'

import {formatPrice} from "~/utils/formatters";

/* -----------------------------
   stores
------------------------------*/

const orderStore = useOrderStore()

const {getLabel, getClass} = useOrderStatus()

const route = useRoute()

/* -----------------------------
   route params
------------------------------*/

const orderId = computed(() => {
    const id = route.params.id

    return Array.isArray(id)
        ? id[0]
        : id
})

/* -----------------------------
   load order (once)
------------------------------*/

await callOnce(async () => {
    if (!orderId.value) {
        return navigateTo('/')
    }

    try {
        await orderStore.fetchOrder(orderId.value)
    } catch {
        throw createError({statusCode: 404})
    }
})

/* -----------------------------
   computed state
------------------------------*/

const order = computed(() => orderStore.currentOrder)

</script>

<template>
    <div class="container py-5">

        <div class="card shadow-sm mx-auto" style="max-width:720px;">
            <div class="card-body p-4">

                <!-- HEADER -->
                <div class="text-center mb-4">

                    <div
                        class="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 text-success fw-bold mb-3"
                        style="width:64px;height:64px;font-size:28px;"
                    >
                        ✔
                    </div>

                    <h3 class="fw-bold mb-2">
                        Заказ успешно оформлен
                    </h3>

                    <p class="text-muted mb-0">
                        Мы начали обработку заказа
                    </p>

                </div>

                <!-- LOADING -->
                <div v-if="!order" class="text-center text-muted py-5">
                    Загрузка заказа...
                </div>

                <!-- CONTENT -->
                <div v-else>

                    <!-- INFO -->
                    <div class="d-flex justify-content-between p-3 bg-light rounded mb-3">

                        <div>
                            <div class="text-muted small">
                                Номер
                            </div>
                            <div class="fw-bold">
                                #{{ order.id }}
                            </div>
                        </div>

                        <div class="text-end">
                            <div class="text-muted small">
                                Сумма
                            </div>
                            <div class="fw-bold text-primary fs-5">
                                {{ formatPrice(order.total) }}
                            </div>
                        </div>

                    </div>

                    <!-- STATUS -->
                    <div class="text-center mb-4">
                            <span
                                class="badge fs-6 px-3 py-2"
                                :class="getClass(order.status)"
                            >
                                {{ getLabel(order.status) }}
                            </span>
                    </div>

                    <!-- ITEMS -->
                    <div v-if="order.items?.length" class="d-flex flex-column gap-2">

                        <div
                            v-for="item in order.items"
                            :key="item.id"
                            class="d-flex justify-content-between p-2 bg-light rounded"
                        >

                            <div>
                                <div class="fw-semibold">
                                    {{ item.name || ('Товар #' + item.car_id) }}
                                </div>

                                <div class="text-muted small">
                                    {{ formatPrice(item.price) }} ₽ × {{ item.qty }}
                                </div>
                            </div>

                            <div class="fw-bold text-primary">
                                {{ formatPrice(item.price * item.qty) }} ₽
                            </div>

                        </div>

                    </div>

                    <!-- COMMENT -->
                    <div v-if="order.comment" class="mt-4 p-3 bg-light rounded">
                        <div class="text-muted small mb-1">
                            Комментарий
                        </div>
                        <div>
                            {{ order.comment }}
                        </div>
                    </div>

                    <!-- ACTIONS -->
                    <div class="d-flex justify-content-center gap-2 mt-4">

                        <NuxtLink to="/cars" class="btn btn-outline-secondary">
                            Продолжить покупки
                        </NuxtLink>

                        <NuxtLink to="/orders" class="btn btn-primary">
                            Мои заказы
                        </NuxtLink>

                    </div>

                </div>

            </div>
        </div>

    </div>
</template>
