<script setup lang="ts">

import {computed, ref} from 'vue'

import {useCartStore} from '~/stores/cart'
import {useDashboardStore} from '~/stores/dashboard'

import BaseTextarea from '~/components/BaseTextarea.vue'
import BaseButton from '~/components/BaseButton.vue'

import CartRemoveItemModal from '~/components/modals/CartRemoveItemModal.vue'
import CartCheckoutModal from '~/components/modals/CartCheckoutModal.vue'
import CartClearModal from '~/components/modals/CartClearModal.vue'

import {formatPrice} from '~/utils/formatters'

const {t} = useI18n()

const cart = useCartStore()
const dashboard = useDashboardStore()

const isSubmitting = ref(false)
const comment = ref('')

const showRemoveModal = ref(false)
const showCheckoutModal = ref(false)
const showClearModal = ref(false)

const selectedItemId = ref<number | null>(null)

const items = computed(() => cart.items)
const total = computed(() => cart.total)

function sanitizeQty(value: unknown) {
    let qty = Number(value)

    if (!Number.isInteger(qty)) {
        qty = Math.floor(qty)
    }

    if (Number.isNaN(qty) || qty < 1) {
        qty = 1
    }

    return qty
}

function openRemoveModal(id: number | string) {
    if (isSubmitting.value) return

    selectedItemId.value = Number(id)
    showRemoveModal.value = true
}

function openClearModal() {
    if (isSubmitting.value) return
    showClearModal.value = true
}

function openCheckoutModal() {
    if (isSubmitting.value) return
    showCheckoutModal.value = true
}

const confirmRemoveItem = async () => {
    if (!selectedItemId.value) return

    await cart.remove(selectedItemId.value)

    showRemoveModal.value = false
    selectedItemId.value = null
}

const confirmClearCart = async () => {
    await cart.clear()
    showClearModal.value = false
}

const confirmCheckout = async () => {
    if (isSubmitting.value) return

    isSubmitting.value = true

    try {
        const res: any = await cart.checkout({
            comment: comment.value
        })

        const order = res?.data?.order || res?.order

        if (!order?.id) {
            throw new Error('Order ID missing in response')
        }

        showCheckoutModal.value = false

        await navigateTo(`/order-success/${order.id}`)

    } finally {
        isSubmitting.value = false
    }
}

</script>

<template>
    <div class="container py-4">

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">{{ t('cart.title') }}</h2>
        </div>

        <div v-if="cart.loading" class="alert alert-light border text-center py-4">
            {{ t('cart.loading') }}
        </div>

        <div
            v-else-if="!Object.keys(items).length"
            class="card border-0 shadow-sm"
        >
            <div class="card-body text-center py-5">
                <h4 class="mb-2">{{ t('cart.emptyTitle') }}</h4>
                <p class="text-muted mb-4">{{ t('cart.emptyText') }}</p>

                <NuxtLink to="/cars" class="btn btn-primary px-4">
                    {{ t('cart.goToCatalog') }}
                </NuxtLink>
            </div>
        </div>

        <div v-else class="row g-4 align-items-start">

            <div class="col-12 col-lg-8">

                <div
                    v-for="(itemData, itemId) in items"
                    :key="itemId"
                    class="card border-0 shadow-sm mb-3"
                >
                    <div class="card-body">

                        <div class="row align-items-center g-3">

                            <div class="col-12 col-md-5">

                                <div class="d-flex align-items-center gap-3">

                                    <NuxtLink :to="`/cars/show/${itemData.id}`">
                                        <img
                                            :src="itemData.photo_url || '/images/default_car.jpg'"
                                            class="rounded border"
                                            style="width:110px;height:80px;object-fit:contain;"
                                        />
                                    </NuxtLink>

                                    <div>

                                        <NuxtLink
                                            :to="`/cars/show/${itemData.id}`"
                                            class="text-decoration-none text-dark"
                                        >
                                            <h5 class="mb-1">{{ itemData.name }}</h5>
                                        </NuxtLink>

                                        <div class="text-muted small">
                                            {{ formatPrice(itemData.price) }} / {{ t('cart.perItem') }}
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div class="col-12 col-md-3">

                                <div class="d-flex justify-content-center align-items-center gap-2">

                                    <button
                                        type="button"
                                        class="btn btn-outline-secondary btn-sm"
                                        :disabled="itemData.qty <= 1 || cart.loadingUpdate"
                                        @click="cart.update(itemId, itemData.qty - 1)"
                                    >
                                        −
                                    </button>

                                    <input
                                        type="text"
                                        class="form-control text-center"
                                        style="width:90px;"
                                        :value="itemData.qty"
                                        @input="cart.update(itemId, sanitizeQty(($event.target as HTMLInputElement).value))"
                                    />

                                    <button
                                        type="button"
                                        class="btn btn-outline-secondary btn-sm"
                                        @click="cart.update(itemId, itemData.qty + 1)"
                                    >
                                        +
                                    </button>

                                </div>

                            </div>

                            <div class="col-8 col-md-3 text-md-end">
                                <div class="fw-bold fs-5">
                                    {{ formatPrice(itemData.price * itemData.qty) }}
                                </div>
                            </div>

                            <div class="col-4 col-md-1 text-end">
                                <button
                                    type="button"
                                    class="btn btn-outline-danger btn-sm"
                                    @click="openRemoveModal(itemId)"
                                >
                                    ✕
                                </button>
                            </div>

                        </div>

                    </div>
                </div>

            </div>

            <div class="col-12 col-lg-4">

                <div class="card border-0 shadow-sm mb-3">
                    <div class="card-body">

                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">{{ t('cart.total') }}:</span>
                            <span class="fs-4 fw-bold text-success">
                                {{ formatPrice(total) }}
                            </span>
                        </div>

                        <hr>

                        <div class="d-flex justify-content-between">
                            <span class="text-muted">{{ t('cart.items') }}:</span>
                            <span class="fw-semibold">{{ Object.keys(items).length }}</span>
                        </div>

                    </div>
                </div>

                <div class="card border-0 shadow-sm mb-3">
                    <div class="card-body">

                        <BaseTextarea
                            v-model="comment"
                            :label="t('cart.comment')"
                            :rows="5"
                            :placeholder="t('cart.commentPlaceholder')"
                            :disabled="isSubmitting"
                        />

                    </div>
                </div>

                <div class="card border-0 shadow-sm">
                    <div class="card-body d-grid gap-2">

                        <BaseButton
                            variant="success"
                            size="lg"
                            class="w-100 py-3 fw-semibold"
                            :loading="isSubmitting"
                            :disabled="isSubmitting"
                            @click="openCheckoutModal"
                        >
                            {{ t('cart.checkout') }}
                            <template #loading>
                                {{ t('cart.checkoutLoading') }}
                            </template>
                        </BaseButton>

                        <BaseButton
                            variant="outline-danger"
                            class="w-100"
                            :disabled="isSubmitting || !Object.keys(items).length"
                            @click="openClearModal"
                        >
                            {{ t('cart.clear') }}
                        </BaseButton>

                    </div>
                </div>

            </div>

        </div>

        <CartRemoveItemModal
            :show="showRemoveModal"
            :processing="cart.loadingRemove"
            @close="showRemoveModal = false"
            @confirm="confirmRemoveItem"
        />

        <CartCheckoutModal
            :show="showCheckoutModal"
            @close="showCheckoutModal = false"
            @success="confirmCheckout"
        />

        <CartClearModal
            :show="showClearModal"
            :processing="cart.loadingClear"
            @close="showClearModal = false"
            @confirm="confirmClearCart"
        />

    </div>
</template>
