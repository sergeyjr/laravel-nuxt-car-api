<script setup lang="ts">

import {computed, onMounted} from 'vue'

import {useI18n} from 'vue-i18n'

import {useOrderStore} from '~/stores/order'

import {useOrderStatus} from '~/composables/useOrderStatus'

import {formatPrice, formatDate} from "~/utils/formatters";

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

/* -----------------------------
   store
------------------------------*/

const orderStore = useOrderStore()

/* -----------------------------
   status helper
------------------------------*/

const {getLabel} = useOrderStatus()

/* -----------------------------
   lifecycle
------------------------------*/

onMounted(async () => {
    await orderStore.fetchOrders()
})

/* -----------------------------
   state
------------------------------*/

const orders = computed(() => orderStore.orders || [])

const loading = computed(() => orderStore.loadingOrders)

const initialized = computed(() => orderStore.initialized)

/* -----------------------------
   status UI
------------------------------*/

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

/* -----------------------------
   navigation
------------------------------*/

const goBack = () => {
    if (import.meta.client && window.history.length > 1) {
        window.history.back()
    } else {
        navigateTo(localePath('/dashboard'))
    }
}

</script>

<template>
    <div class="container mt-4">

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">{{ t('order.myOrdersTitle') }}</h2>

            <BaseButton
                v-if="initialized"
                variant="outline-secondary"
                @click="goBack"
            >
                ← {{ t('nav.back') }}
            </BaseButton>
        </div>

        <div v-if="loading || !initialized" class="alert alert-light border text-center py-4">
            {{ t('order.loadingList') }}
        </div>

        <div v-else-if="!orders.length" class="alert alert-light border text-center py-4">
            {{ t('order.emptyList') }}
        </div>

        <div v-else class="table-responsive">

            <table class="table table-hover align-middle">
                <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>{{ t('order.dateTime') }}</th>
                    <th>{{ t('order.status') }}</th>
                    <th>{{ t('order.items') }}</th>
                    <th class="text-end">{{ t('order.total') }}</th>
                    <th class="text-end">{{ t('order.actions') }}</th>
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
                            :to="localePath(`/orders/show/${order.id}`)"
                            class="btn btn-sm btn-outline-primary"
                        >
                            {{ t('order.open') }}
                        </NuxtLink>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>
