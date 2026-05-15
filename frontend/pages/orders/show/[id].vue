<script setup lang="ts">

import {computed} from 'vue'
import {useAsyncData} from '#app'

import {useOrderStore} from '~/stores/order'

import {useOrderStatus} from '~/composables/useOrderStatus'

/* -----------------------------
   route / store
------------------------------*/

const route = useRoute()
const store = useOrderStore()

/* -----------------------------
   status helper
------------------------------*/

const {getLabel, getBadge} = useOrderStatus()

/* -----------------------------
   order id
------------------------------*/

const orderId = computed(() => String(route.params.id ?? ''))

if (!orderId.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Order ID is missing'
    })
}

/* -----------------------------
   fetch (SSR + client)
------------------------------*/

await useAsyncData(
    () => `order-${orderId.value}`,
    async () => {
        try {
            const result = await store.fetchOrder(orderId.value)

            return result ?? store.currentOrder ?? null

        } catch (err: any) {
            // soft fallback for not found
            if (err?.statusCode === 404 || err?.status === 404) {
                return null
            }

            throw err
        }
    },
    {
        watch: [orderId]
    }
)

/* -----------------------------
   state
------------------------------*/

const order = computed(() => store.currentOrder)
const loadingOrder = computed(() => store.loadingOrder)

/* -----------------------------
   derived state
------------------------------*/

const hasComment = computed(() => {
    const c = order.value?.comment
    return c != null && String(c).trim() !== ''
})

/* -----------------------------
   formatters
------------------------------*/

// price
const formatPrice = (v: number | string) =>
    new Intl.NumberFormat('ru-RU').format(Number(v || 0)) + ' ₽'

// date
const formatDate = (date: string) => {
    if (!date) return ''

    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: 'Europe/Amsterdam'
    }).format(new Date(date))
}

/* -----------------------------
   item helpers
------------------------------*/

const getItemName = (item: any) =>
    item?.name || item?.car?.title || `Машина #${item?.car_id ?? ''}`

const getItemPhoto = (item: any) =>
    item?.photo_url || item?.car?.photo_url || '/images/default_car.jpg'

/* -----------------------------
   navigation
------------------------------*/

const goBack = () => {
    if (import.meta.client && window.history.length > 1) {
        window.history.back()
    } else {
        navigateTo('/dashboard')
    }
}

</script>

<template>
    <div class="container py-4">

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-3">
                Заказ #{{ order.id }}
            </h2>

            <button class="btn btn-outline-secondary" @click="goBack">
                ← Назад
            </button>
        </div>

        <div
            v-if="loadingOrder && !order"
            class="alert alert-light border text-center py-4"
        >
            Загрузка заказа...
        </div>

        <div
            v-else-if="!loadingOrder && !order"
            class="alert alert-warning border text-center py-5"
        >
            <h4 class="mb-2">Заказ не найден</h4>
            <div class="text-muted mb-3">
                Возможно, он был удалён или у вас нет доступа
            </div>

            <NuxtLink to="/orders" class="btn btn-primary">
                Вернуться к заказам
            </NuxtLink>
        </div>

        <div v-else-if="order" class="row g-4">
            <div class="col-12 col-lg-8">
                <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="card border-0 shadow-sm mb-3"
                >
                    <div class="card-body">
                        <div class="row align-items-center g-3">
                            <div class="col-12 col-md-6">
                                <div class="d-flex align-items-center gap-3">
                                    <NuxtLink :to="`/cars/show/${item.car_id}`">
                                        <img
                                            :src="getItemPhoto(item)"
                                            class="rounded border"
                                            style="width:110px;height:80px;object-fit:contain;"
                                            alt=""/>
                                    </NuxtLink>

                                    <div>
                                        <NuxtLink
                                            :to="`/cars/show/${item.car_id}`"
                                            class="text-decoration-none text-dark"
                                        >
                                            <h5 class="mb-1">
                                                {{ getItemName(item) }}
                                            </h5>
                                        </NuxtLink>

                                        <div class="text-muted small">
                                            {{ formatPrice(item.price) }} / шт
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-6 col-md-2 text-center">
                                <div class="text-muted small mb-1">Кол-во</div>
                                <div class="fw-semibold">{{ item.qty }}</div>
                            </div>

                            <div class="col-6 col-md-2 text-center">
                                <div class="text-muted small mb-1">Цена</div>
                                <div class="fw-semibold">
                                    {{ formatPrice(item.price) }}
                                </div>
                            </div>

                            <div class="col-12 col-md-2 text-md-end">
                                <div class="text-muted small mb-1">Сумма</div>
                                <div class="fw-bold fs-5">
                                    {{ formatPrice(item.qty * item.price) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-4">

                <div class="card border-0 shadow-sm mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-muted">Итого:</span>
                            <span class="fs-4 fw-bold text-success">
                                {{ formatPrice(order.total) }}
                            </span>
                        </div>

                        <hr>

                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Позиций:</span>
                            <span class="fw-semibold">
                                {{ order.items?.length || 0 }}
                            </span>
                        </div>
                    </div>
                </div>

                <div v-if="hasComment" class="card border-0 shadow-sm mb-3">
                    <div class="card-body">
                        <div class="text-muted small mb-1">
                            Комментарий:
                        </div>
                        {{ order.comment }}
                    </div>
                </div>

                <div class="card border-0 shadow-sm mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div class="text-muted small">Дата:</div>
                            <div class="fw-semibold">
                                {{ formatDate(order.created_at) }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div class="text-muted small">Статус:</div>
                            <span class="badge" :class="getBadge(order.status).class">
                                {{ getLabel(order.status) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <NuxtLink to="/orders" class="btn btn-outline-primary w-100">
                            Все заказы
                        </NuxtLink>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>
