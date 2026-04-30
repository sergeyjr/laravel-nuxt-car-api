<script setup>

import {computed} from 'vue'
import {useOrderStore} from '~/stores/order'

const store = useOrderStore()

await callOnce(() => store.fetchOrders())

const orders = computed(() => store.orders || [])
const loading = computed(() => store.loading)

const formatPrice = (price) =>
    new Intl.NumberFormat('ru-RU').format(price) + ' ₽'

const goToOrder = (id) => navigateTo(`/orders/${id}`)

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

        <!-- HEADER -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Мои заказы</h2>

            <button class="btn btn-outline-secondary" @click="goBack">
                ← Назад
            </button>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="alert alert-light">
            Загружается...
        </div>

        <!-- EMPTY -->
        <div v-else-if="!orders.length">
            <div class="alert alert-light">
                У вас пока нет заказов
            </div>

            <NuxtLink to="/dashboard" class="btn btn-outline-secondary">
                В панель
            </NuxtLink>
        </div>

        <!-- LIST -->
        <div v-else class="row g-3">

            <div
                v-for="order in orders"
                :key="order.id"
                class="col-12 col-md-6 col-lg-4"
            >
                <div class="card h-100 shadow-sm border-0">

                    <div class="card-body d-flex flex-column justify-content-between">

                        <div>
                            <h5>Заказ #{{ order.id }}</h5>

                            <div class="text-muted small">
                                {{ new Date(order.created_at).toLocaleString('ru-RU') }}
                            </div>

                            <div class="mt-2">
                <span class="badge">
                  {{ order.status }}
                </span>
                            </div>
                        </div>

                        <div class="mt-3 d-flex justify-content-between">

                            <div>
                                <div class="fw-bold text-success">
                                    {{ formatPrice(order.total) }}
                                </div>

                                <small class="text-muted">
                                    {{ order.items?.length || 0 }} товаров
                                </small>
                            </div>

                            <button
                                class="btn btn-outline-primary btn-sm"
                                @click="goToOrder(order.id)"
                            >
                                Подробнее
                            </button>

                        </div>

                    </div>

                </div>
            </div>

        </div>

    </div>
</template>
