<script setup>

import {computed, onMounted} from 'vue'
import {useAuthStore} from '~/stores/auth'
import {useDashboardStore} from '~/stores/dashboard'

const auth = useAuthStore()
const dashboard = useDashboardStore()

onMounted(() => {
    dashboard.fetchDashboard()
})

const user = computed(() => auth.user)

const isApiUser = computed(() => auth.user?.role === 'api')

const ordersCount = computed(() => dashboard.ordersCount)

const recentOrders = computed(() => dashboard.orders || [])

const cartCount = computed(() =>
    Object.values(dashboard.cart || {}).reduce(
        (sum, item) => sum + (item.qty || 0),
        0
    )
)

const cartTotal = computed(() => dashboard.cartTotal || 0)

const formatPrice = (v) =>
    new Intl.NumberFormat('ru-RU').format(v) + ' ₽'

const formatDate = (date) => {
    if (!date) return ''

    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: 'Europe/Amsterdam'
    }).format(new Date(date))
}

</script>

<template>
    <div class="container mt-4">

        <h1 class="mb-3">Панель управления</h1>

        <div v-if="dashboard.loading">Загрузка...</div>

        <template v-else>

            <div class="row">

                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">

                            <h5>Мой профиль</h5>
                            <p>Добро пожаловать, {{ user?.name || 'пользователь' }}</p>
                            <p>{{ user?.email || '—' }}</p>

                            <NuxtLink
                                to="/dashboard/profile"
                                class="btn btn-outline-secondary w-100 mt-3"
                            >
                                Мой профиль
                            </NuxtLink>

                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">

                            <h5>Каталог</h5>

                            <p class="mb-0">
                                Машины:
                                <span class="fw-bold">{{ dashboard.carsCount }}</span>
                            </p>

                            <NuxtLink
                                v-if="isApiUser"
                                to="/dashboard/car/create"
                                class="btn btn-primary w-100 mt-3"
                            >
                                Добавить авто
                            </NuxtLink>

                            <NuxtLink v-else
                                to="/cars"
                                class="btn btn-outline-primary w-100 mt-3"
                            >
                                Перейти в каталог
                            </NuxtLink>

                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">

                            <h5>Корзина</h5>

                            <p class="mb-1 text-muted">
                                Товаров:
                                <span class="fw-bold">{{ cartCount }}</span>
                            </p>

                            <p class="mb-0">
                                Стоимость:
                                <span class="fw-bold">{{ formatPrice(cartTotal) }}</span>
                            </p>

                            <div
                                v-if="cartTotal === 0"
                                class="btn btn-outline-secondary w-100 mt-3"
                            >
                                Корзина пустая
                            </div>

                            <NuxtLink
                                v-else
                                to="/cart"
                                class="btn btn-outline-success w-100 mt-3"
                            >
                                Перейти в корзину
                            </NuxtLink>

                        </div>
                    </div>
                </div>

            </div>

            <div class="mt-4">

                <div class="row mb-3">
                    <div class="col-12">
                        <h4>Заказы</h4>
                    </div>
                </div>

                <div v-if="!recentOrders.length" class="alert alert-light">
                    У вас пока нет заказов
                </div>

                <div v-else class="row g-3">

                    <div class="col-12 col-md-12">
                            <span class="text-muted">
                                Всего заказов: {{ ordersCount }}
                            </span>
                    </div>

                    <div class="col-12 col-md-12 mt-2">
                        <NuxtLink
                            to="/orders"
                            class="btn btn-outline-primary btn-sm"
                        >
                            Посмотреть все
                        </NuxtLink>
                    </div>

                    <div
                        v-for="order in recentOrders"
                        :key="order.id"
                        class="col-12 col-md-6 col-lg-4"
                    >
                        <div class="card h-100 shadow-sm border-0">

                            <div class="card-body d-flex flex-column justify-content-between">

                                <div>
                                    <h6 class="mb-1 text-truncate">
                                        Заказ #{{ order.id }}
                                    </h6>

                                    <div class="text-muted small">
                                        Создан: {{ formatDate(order?.created_at) }}
                                    </div>

                                    <div class="mt-2">
                                        <span
                                            class="badge"
                                            :class="{
                                                'bg-warning': order.status === 'pending',
                                                'bg-success': order.status === 'paid',
                                                'bg-danger': order.status === 'cancelled',
                                                'bg-secondary': order.status === 'completed'
                                            }"
                                        >
                                            {{ order.status }}
                                        </span>
                                    </div>
                                </div>

                                <div class="mt-3 d-flex justify-content-between align-items-center">

                                    <div class="fw-bold text-success">
                                        {{ formatPrice(order.total) }}
                                    </div>

                                    <NuxtLink
                                        :to="`/orders/${order.id}`"
                                        class="btn btn-sm btn-outline-primary"
                                    >
                                        Открыть
                                    </NuxtLink>

                                </div>

                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </template>

    </div>
</template>
