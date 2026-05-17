<script setup lang="ts">

import {computed, onMounted} from 'vue'

import {useI18n} from 'vue-i18n'

import {useAuthStore} from '~/stores/auth'
import {useDashboardStore} from '~/stores/dashboard'

import {useOrderStatus} from '~/composables/useOrderStatus'

import {formatPrice, formatDate} from '~/utils/formatters'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

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

        <h1 class="mb-4">{{ t('dashboard.title') }}</h1>

        <div v-if="dashboard.loading" class="alert alert-light border text-center py-4">
            {{ t('page.loading') }}
        </div>

        <template v-else>

            <div class="row">

                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">

                            <h5 class="mb-3">
                                <NuxtLink :to="localePath('/dashboard/profile')" class="text-decoration-none text-dark">
                                    {{ t('dashboard.profile.title') }}
                                </NuxtLink>
                            </h5>

                            <p>
                                {{ t('dashboard.profile.welcome') }}
                                <span class="fw-bold">{{ user?.name || t('dashboard.profile.guest') }}</span>
                            </p>

                            <p>
                                {{ t('dashboard.profile.email') }}:
                                <span class="fw-bold">{{ user?.email }}</span>
                            </p>

                            <NuxtLink :to="localePath('/dashboard/profile')" class="btn btn-outline-primary w-100 mt-3">
                                {{ t('dashboard.profile.button') }}
                            </NuxtLink>

                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">

                            <h5 class="mb-3">
                                <NuxtLink :to="localePath('/cars')" class="text-decoration-none text-dark">
                                    {{ t('dashboard.catalog.title') }}
                                </NuxtLink>
                            </h5>

                            <p class="mb-0">
                                {{ t('dashboard.catalog.totalCars') }}:
                                <span class="fw-bold">{{ dashboard.carsCount }}</span>
                            </p>

                            <p class="mb-0">
                                {{ t('dashboard.catalog.myCars') }}:
                                <span class="fw-bold">{{ dashboard.myCarsCount }}</span>
                            </p>

                            <NuxtLink v-if="isApiUser" :to="localePath('/dashboard/car/create')" class="btn btn-outline-primary w-100 mt-3">
                                {{ t('dashboard.catalog.addCar') }}
                            </NuxtLink>

                            <NuxtLink v-else :to="localePath('/cars')" class="btn btn-outline-primary w-100 mt-3">
                                {{ t('dashboard.catalog.goToCatalog') }}
                            </NuxtLink>

                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">

                            <h5 class="mb-3">
                                <NuxtLink :to="localePath('/cart')" class="text-decoration-none text-dark">
                                    {{ t('nav.cart') }}
                                </NuxtLink>
                            </h5>

                            <template v-if="cartTotal === 0">

                                <div class="btn btn-outline-secondary w-100 mt-3 disabled">
                                    {{ t('dashboard.cart.empty') }}
                                </div>

                            </template>

                            <template v-else>

                                <p class="text-muted">
                                    {{ t('dashboard.cart.items') }}:
                                    <span class="fw-bold">{{ cartCount }}</span>
                                </p>

                                <p class="mb-0">
                                    {{ t('dashboard.cart.total') }}:
                                    <span class="fw-bold">{{ formatPrice(cartTotal) }}</span>
                                </p>

                                <NuxtLink :to="localePath('/cart')" class="btn btn-outline-primary w-100 mt-3">
                                    {{ t('dashboard.cart.open') }}
                                </NuxtLink>

                            </template>

                        </div>
                    </div>
                </div>

            </div>

            <div class="mt-4">

                <div class="row mb-3">

                    <div class="col-12 d-flex justify-content-between align-items-center">

                        <NuxtLink :to="localePath('/orders')" class="text-decoration-none text-dark">
                            <h4 class="mb-3">{{ t('dashboard.orders.title') }}</h4>
                        </NuxtLink>

                        <NuxtLink :to="localePath('/orders')" class="btn btn-outline-primary btn-sm">
                            {{ t('dashboard.orders.all') }}
                        </NuxtLink>

                    </div>

                    <div class="col-12">
                        <span class="text-muted">
                            {{ t('dashboard.orders.total') }}:
                            <span class="fw-bold">{{ ordersCount }}</span>
                        </span>
                    </div>

                </div>

                <div v-if="!recentOrders.length" class="alert alert-light border text-center py-4">
                    {{ t('dashboard.orders.empty') }}
                </div>

                <div v-else class="table-responsive">

                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>{{ t('dashboard.orders.date') }}</th>
                            <th>{{ t('dashboard.orders.status') }}</th>
                            <th class="text-end">{{ t('dashboard.orders.amount') }}</th>
                            <th class="text-end">{{ t('dashboard.orders.action') }}</th>
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
                                <NuxtLink :to="localePath(`/orders/show/${order.id}`)" class="btn btn-sm btn-outline-primary">
                                    {{ t('dashboard.orders.open') }}
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
