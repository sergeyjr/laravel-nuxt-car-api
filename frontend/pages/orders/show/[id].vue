<script setup lang="ts">

import {computed, ref, onMounted, watch} from 'vue'
import {useI18n} from 'vue-i18n'

import {useOrderStore} from '~/stores/order'
import {useOrderStatus} from '~/composables/useOrderStatus'

import {formatPrice, formatDate} from '~/utils/formatters'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

/* -----------------------------
   route / store
------------------------------*/

const route = useRoute()
const orderStore = useOrderStore()

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
   state
------------------------------*/

const loaded = ref(false)

const order = computed(() => orderStore.currentOrder)
const loadingOrder = computed(() => orderStore.loadingOrder)

/* -----------------------------
   load order
------------------------------*/

const loadOrder = async (id: string) => {
    await orderStore.fetchOrder(id)
}

/* -----------------------------
   derived state
------------------------------*/

const hasComment = computed(() => {
    const c = order.value?.comment
    return c != null && String(c).trim() !== ''
})

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
        navigateTo(localePath('/dashboard'))
    }
}

/* -----------------------------
   lifecycle
------------------------------*/

onMounted(async () => {
    loaded.value = false
    await loadOrder(orderId.value)
    loaded.value = true
})

watch(orderId, async (newId, oldId) => {
    if (!newId || newId === oldId) return
    loaded.value = false
    await loadOrder(newId)
    loaded.value = true
})

</script>

<template>
    <div class="container py-4">

        <template v-if="loadingOrder || !loaded">

            <div class="alert alert-light border text-center py-4">
                {{ t('orderDetail.loading') }}
            </div>

        </template>

        <template v-else-if="order">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-3">
                    {{ t('orderDetail.title', {id: order.id}) }}
                </h2>

                <button
                    class="btn btn-outline-secondary"
                    @click="goBack"
                >
                    ← {{ t('nav.back') }}
                </button>
            </div>

            <div class="row g-4">

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

                                        <NuxtLink :to="localePath(`/cars/show/${item.car_id}`)">
                                            <img
                                                :src="getItemPhoto(item)"
                                                class="rounded border"
                                                style="width:110px;height:80px;object-fit:contain;"
                                                alt=""
                                            />
                                        </NuxtLink>

                                        <div>

                                            <NuxtLink
                                                :to="localePath(`/cars/show/${item.car_id}`)"
                                                class="text-decoration-none text-dark"
                                            >
                                                <h5 class="mb-1">
                                                    {{ getItemName(item) }}
                                                </h5>
                                            </NuxtLink>

                                            <div class="text-muted small">
                                                {{ formatPrice(item.price) }} / {{ t('orderDetail.perItem') }}
                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div class="col-6 col-md-2 text-center">
                                    <div class="text-muted small mb-1">
                                        {{ t('orderDetail.qty') }}
                                    </div>
                                    <div class="fw-semibold">{{ item.qty }}</div>
                                </div>

                                <div class="col-6 col-md-2 text-center">
                                    <div class="text-muted small mb-1">
                                        {{ t('orderDetail.price') }}
                                    </div>
                                    <div class="fw-semibold">
                                        {{ formatPrice(item.price) }}
                                    </div>
                                </div>

                                <div class="col-12 col-md-2 text-md-end">
                                    <div class="text-muted small mb-1">
                                        {{ t('orderDetail.sum') }}
                                    </div>
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
                                <span class="text-muted">{{ t('orderDetail.total') }}:</span>
                                <span class="fs-4 fw-bold text-success">
                                    {{ formatPrice(order.total) }}
                                </span>
                            </div>

                            <hr>

                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">{{ t('orderDetail.itemsCount') }}:</span>
                                <span class="fw-semibold">
                                    {{ order.items?.length || 0 }}
                                </span>
                            </div>

                        </div>
                    </div>

                    <div v-if="hasComment" class="card border-0 shadow-sm mb-3">
                        <div class="card-body">
                            <div class="text-muted small mb-1">
                                {{ t('orderDetail.comment') }}:
                            </div>
                            {{ order.comment }}
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div class="text-muted small">{{ t('orderDetail.date') }}:</div>
                                <div class="fw-semibold">
                                    {{ formatDate(order.created_at) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div class="text-muted small">{{ t('orderDetail.status') }}:</div>
                                <span class="badge" :class="getBadge(order.status).class">
                                    {{ getLabel(order.status) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <NuxtLink :to="localePath('/orders')" class="btn btn-outline-primary w-100">
                                {{ t('orderDetail.allOrders') }}
                            </NuxtLink>
                        </div>
                    </div>

                </div>

            </div>

        </template>

        <template v-else>

            <div class="alert alert-warning border text-center py-5">

                <h4 class="mb-2">
                    {{ t('orderDetail.notFoundTitle') }}
                </h4>

                <div class="text-muted mb-3">
                    {{ t('orderDetail.notFoundSubtitle') }}
                </div>

                <NuxtLink :to="localePath('/orders')" class="btn btn-primary">
                    {{ t('orderDetail.backToOrders') }}
                </NuxtLink>

            </div>

        </template>

    </div>
</template>
