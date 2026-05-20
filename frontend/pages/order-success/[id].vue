<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useOrderStore } from '~/stores/order'
import { useOrderStatus } from '~/composables/useOrderStatus'
import { formatPrice } from '~/utils/formatters'

/* -----------------------------
   i18n
------------------------------*/

const { t } = useI18n()

const localePath = useLocalePath()

/* -----------------------------
   stores
------------------------------*/

const orderStore = useOrderStore()
const { getLabel, getClass } = useOrderStatus()
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
   helpers
------------------------------*/

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/* -----------------------------
   load order (with retry)
------------------------------*/

await callOnce(async () => {

    if (!orderId.value) {
        return navigateTo(localePath('/'))
    }

    let attempts = 0
    const maxAttempts = 5

    while (attempts < maxAttempts) {
        try {
            await orderStore.fetchOrder(orderId.value)

            if (orderStore.currentOrder?.id) {
                return
            }
        } catch (e) {
            console.error(e)
        }

        attempts++
        await sleep(700)
    }

    throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
    })
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
                        {{ t('order.successTitle') }}
                    </h3>

                    <p class="text-muted mb-0">
                        {{ t('order.successSubtitle') }}
                    </p>

                </div>

                <!-- LOADING -->
                <div v-if="!order" class="text-center text-muted py-5">
                    {{ t('order.loading') }}
                </div>

                <!-- CONTENT -->
                <div v-else>

                    <!-- INFO -->
                    <div class="d-flex justify-content-between p-3 bg-light rounded mb-3">

                        <div>
                            <div class="text-muted small">
                                {{ t('order.number') }}
                            </div>
                            <div class="fw-bold">
                                #{{ order.id }}
                            </div>
                        </div>

                        <div class="text-end">
                            <div class="text-muted small">
                                {{ t('order.total') }}
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
                                    {{ item.name || (t('order.itemFallback') + ' #' + item.car_id) }}
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
                            {{ t('order.comment') }}
                        </div>
                        <div>
                            {{ order.comment }}
                        </div>
                    </div>

                    <!-- ACTIONS -->
                    <div class="d-flex justify-content-center gap-2 mt-4">

                        <NuxtLink :to="localePath('/catalog')" class="btn btn-outline-secondary">
                            {{ t('order.continueShopping') }}
                        </NuxtLink>

                        <NuxtLink :to="localePath('/orders')" class="btn btn-primary">
                            {{ t('order.myOrders') }}
                        </NuxtLink>

                    </div>

                </div>

            </div>
        </div>

    </div>
</template>
