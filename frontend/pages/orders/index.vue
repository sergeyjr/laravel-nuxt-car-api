<script setup lang="ts">

import {computed, onMounted} from 'vue'

import {useOrderStore} from '~/stores/order'
import {useOrderStatus} from '~/composables/useOrderStatus'

const store = useOrderStore()
const {getLabel} = useOrderStatus()

onMounted(async () => {
    await store.fetchOrders()
})

const orders = computed(() => store.orders || [])
const loading = computed(() => store.loadingOrders)
const initialized = computed(() => store.initialized)

const formatPrice = (price: number | string) =>
    new Intl.NumberFormat('ru-RU').format(Number(price)) + ' ₽'

const formatDate = (date: string) => {
    if (!date) return ''

    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: 'Europe/Amsterdam'
    }).format(new Date(date))
}

const statusBadgeClass = (status: string) => {
    switch (status) {
        case 'pending_payment':
            return 'bg-warning text-dark'
        case 'processing':
            return 'bg-info text-dark'
        case 'packed':
        case 'shipped':
            return 'bg-primary'
        case 'completed':
            return 'bg-success'
        case 'cancelled':
            return 'bg-danger'
        case 'refunded':
            return 'bg-secondary'
        default:
            return 'bg-secondary'
    }
}

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

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Мои заказы</h2>

            <button class="btn btn-outline-secondary" @click="goBack">
                ← Назад
            </button>
        </div>

        <div v-if="loading || !initialized" class="alert alert-light border text-center py-4">
            Страница загружается...
        </div>

        <div v-else-if="!orders.length" class="alert alert-light border text-center py-4">
            У вас пока нет заказов
        </div>

        <div v-else class="table-responsive">

            <table class="table table-hover align-middle">
                <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Дата и время</th>
                    <th>Статус</th>
                    <th>Товаров</th>
                    <th class="text-end">Сумма</th>
                    <th class="text-end">Действия</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="order in orders" :key="order.id">
                    <td class="fw-bold">#{{ order.id }}</td>

                    <td>
                        {{ formatDate(order.created_at) }}
                    </td>

                    <td>
                        <span class="badge" :class="statusBadgeClass(order.status)">
                            {{ getLabel(order.status) }}
                        </span>
                    </td>

                    <td>
                        {{ order.items?.length || 0 }}
                    </td>

                    <td class="text-end fw-bold">
                        {{ formatPrice(order.total) }}
                    </td>

                    <td class="text-end">
                        <NuxtLink
                            :to="`/orders/show/${order.id}`"
                            class="btn btn-sm btn-outline-primary"
                        >
                            Открыть
                        </NuxtLink>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>
