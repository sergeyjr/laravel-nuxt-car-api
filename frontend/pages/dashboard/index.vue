<script setup lang="ts">

import {computed, onMounted} from 'vue'

import {useAuthStore} from '~/stores/auth'
import {useDashboardStore} from '~/stores/dashboard'

import {useOrderStatus} from '~/composables/useOrderStatus'

import {formatPrice, formatDate} from '~/utils/formatters'

/* -----------------------------
   helpers
------------------------------*/

const {getBadge} = useOrderStatus()

/* -----------------------------
   stores
------------------------------*/

const auth = useAuthStore()

const dashboard = useDashboardStore()

/* -----------------------------
   lifecycle
------------------------------*/

onMounted(async () => {
    await dashboard.fetchDashboard()
})

/* -----------------------------
   auth state
------------------------------*/

const user = computed(() => auth.user)

const isApiUser = computed(() => auth.user?.role === 'api')

/* -----------------------------
   dashboard state
------------------------------*/

const ordersCount = computed(() => dashboard.ordersCount)

const recentOrders = computed(() => dashboard.orders || [])

const cartCount = computed(() =>
    Object.keys(dashboard.cart || {}).length
)

const cartTotal = computed(() => dashboard.cartTotal || 0)

</script>

<template>
    <div class="container mt-4">

        <h1 class="mb-4">Панель управления</h1>

        <div v-if="dashboard.loading" class="alert alert-light border text-center py-4">
            Загрузка страницы...
        </div>

        <template v-else>

            <div class="row">

                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">

                            <NuxtLink to="/dashboard/profile" class="text-decoration-none text-dark">
                                <h5 class="mb-3">Мой профиль</h5>
                            </NuxtLink>

                            <p>Добро пожаловать, <span class="fw-bold">{{ user?.name || 'пользователь' }}</span></p>
                            <p>Email: <span class="fw-bold">{{ user?.email }}</span></p>

                            <NuxtLink
                                to="/dashboard/profile"
                                class="btn btn-outline-primary w-100 mt-3"
                            >
                                Мой профиль
                            </NuxtLink>

                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">

                            <NuxtLink to="/cars" class="text-decoration-none text-dark">
                                <h5 class="mb-3">Каталог</h5>
                            </NuxtLink>

                            <p class="mb-0">
                                Машины всего:
                                <span class="fw-bold">{{ dashboard.carsCount }}</span>
                            </p>

                            <p class="mb-0">
                                Мои машины:
                                <span class="fw-bold">{{ dashboard.myCarsCount }}</span>
                            </p>

                            <NuxtLink
                                v-if="isApiUser"
                                to="/dashboard/car/create"
                                class="btn btn-outline-primary w-100 mt-3"
                            >
                                Добавить авто
                            </NuxtLink>

                            <NuxtLink
                                v-else
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

                            <template v-if="cartTotal === 0">

                                <h5 class="mb-3">Корзина</h5>

                                <div class="btn btn-outline-secondary w-100 mt-3 disabled">
                                    Корзина пустая
                                </div>

                            </template>

                            <template v-else>

                                <NuxtLink to="/cart" class="text-decoration-none text-dark">
                                    <h5 class="mb-3">Корзина</h5>
                                </NuxtLink>

                                <p class="text-muted">
                                    Товаров:
                                    <span class="fw-bold">{{ cartCount }}</span>
                                </p>

                                <p class="mb-0">
                                    Стоимость:
                                    <span class="fw-bold">{{ formatPrice(cartTotal) }}</span>
                                </p>

                                <NuxtLink
                                    to="/cart"
                                    class="btn btn-outline-primary w-100 mt-3"
                                >
                                    Перейти в корзину
                                </NuxtLink>

                            </template>

                        </div>
                    </div>
                </div>

            </div>

            <div class="mt-4">

                <div class="row mb-3">

                    <div class="col-12 d-flex justify-content-between align-items-center">

                        <NuxtLink to="/orders" class="text-decoration-none text-dark">
                            <h4 class="mb-3">Заказы</h4>
                        </NuxtLink>

                        <NuxtLink
                            to="/orders"
                            class="btn btn-outline-primary btn-sm"
                        >
                            Посмотреть все
                        </NuxtLink>

                    </div>

                    <div class="col-12">
                        <span class="text-muted">
                            Всего заказов:
                            <span class="fw-bold">{{ ordersCount }}</span>
                        </span>
                    </div>

                </div>

                <div v-if="!recentOrders.length" class="alert alert-light">
                    У вас пока нет заказов
                </div>

                <div v-else class="table-responsive">

                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Дата и время</th>
                            <th>Статус</th>
                            <th class="text-end">Сумма</th>
                            <th class="text-end">Действие</th>
                        </tr>
                        </thead>

                        <tbody>

                        <tr v-for="order in recentOrders" :key="order.id">

                            <td class="fw-semibold">#{{ order.id }}</td>

                            <td class="text-muted">
                                {{ formatDate(order?.created_at) }}
                            </td>

                            <td>
                                <span class="badge" :class="getBadge(order.status).class">
                                    {{ getBadge(order.status).label }}
                                </span>
                            </td>

                            <td class="text-end fw-bold text-success">
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

    </div>
</template>
