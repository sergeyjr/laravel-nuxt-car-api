<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCartStore } from '~/stores/cart'

import BaseTextarea from '~/components/BaseTextarea.vue'
import BaseButton from '~/components/BaseButton.vue'

import CartRemoveItemModal from '~/components/modals/CartRemoveItemModal.vue'
import CartCheckoutModal from '~/components/modals/CartCheckoutModal.vue'
import CartClearModal from '~/components/modals/CartClearModal.vue'

import { formatPrice } from '~/utils/formatters'

/* -----------------------------
   i18n
------------------------------*/

const { t } = useI18n()

const localePath = useLocalePath()

/* -----------------------------
   stores
------------------------------*/

const cartStore = useCartStore()

/* -----------------------------
   state
------------------------------*/

const isSubmitting = ref(false)
const isUpdatingCart = ref(false)
const comment = ref('')

const showRemoveModal = ref(false)
const showCheckoutModal = ref(false)
const showClearModal = ref(false)

const selectedItemId = ref<number | null>(null)

/* -----------------------------
   computed
------------------------------*/

const items = computed(() => cartStore.items)
const total = computed(() => cartStore.total)

/* -----------------------------
   LOCAL QTY STATE
------------------------------*/

const localQty = ref<Record<string, number>>({})

const getQty = (id: string | number) => {
    return localQty.value[String(id)] ?? items.value?.[id]?.qty ?? 1
}

watch(
    items,
    (val) => {
        const next: Record<string, number> = {}
        Object.entries(val || {}).forEach(([id, item]: any) => {
            next[id] = item.qty
        })
        localQty.value = next
    },
    { immediate: true }
)

/* -----------------------------
   utils
------------------------------*/

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

function preventInvalidQtyKeys(event: KeyboardEvent) {
    if (
        event.key === '-' ||
        event.key === '.' ||
        event.key === ',' ||
        event.key === 'e' ||
        event.key === 'E' ||
        event.key === '+'
    ) {
        event.preventDefault()
    }
}

function normalizeQtyInput(value: unknown) {
    const onlyDigits = String(value).replace(/\D/g, '')
    const num = Number(onlyDigits)
    return Number.isFinite(num) && num > 0 ? num : 1
}

/* -----------------------------
   guards
------------------------------*/

const isLocked = computed(() =>
    isUpdatingCart.value ||
    isSubmitting.value
)

const hasChanges = computed(() => {
    return Object.entries(localQty.value).some(([id, qty]) => {
        return items.value?.[id]?.qty !== qty
    })
})

/* -----------------------------
   modals
------------------------------*/

function openCheckoutModal() {
    if (isLocked.value) {
        return
    }
    showCheckoutModal.value = true
}

function openClearModal() {
    if (isLocked.value || cartStore.loadingClear) {
        return
    }
    showClearModal.value = true
}

function openRemoveModal(id: number | string) {
    if (isLocked.value || cartStore.loadingRemove) {
        return
    }
    selectedItemId.value = Number(id)
    showRemoveModal.value = true
}

/* -----------------------------
   actions
------------------------------*/

const updateQtyLocal = (id: string | number, value: unknown) => {
    if (isLocked.value) return
    localQty.value[String(id)] = normalizeQtyInput(value)
}

const applyCartUpdates = async () => {
    if (isLocked.value) return
    isUpdatingCart.value = true
    try {
        const entries = Object.entries(localQty.value)
        for (const [id, qty] of entries) {
            const original = items.value?.[id]?.qty
            if (original !== qty) {
                await cartStore.update(id, qty)
            }
        }
    } finally {
        isUpdatingCart.value = false
    }
}

const confirmCheckout = async () => {
    if (isLocked.value) return

    isSubmitting.value = true
    try {
        const res: any = await cartStore.checkout({
            comment: comment.value
        })

        const order =
            res?.data?.order ||
            res?.order ||
            res?.data

        if (!order?.id) {
            throw new Error('Order ID missing in response')
        }

        showCheckoutModal.value = false

        cartStore.reset()

        navigateTo(localePath(`/order-success/${order.id}`))
    } catch (e) {
        console.error(e)
    } finally {
        isSubmitting.value = false
    }
}

const confirmClearCart = async () => {
    if (isLocked.value) return
    try {
        await cartStore.clear()
        showClearModal.value = false
    } catch (e) {
        console.error(e)
    }
}

const confirmRemoveItem = async () => {
    if (isLocked.value) return
    if (!selectedItemId.value) {
        return
    }
    try {
        await cartStore.remove(selectedItemId.value)
        showRemoveModal.value = false
    } catch (e) {
        console.error(e)
    } finally {
        selectedItemId.value = null
    }
}
</script>

<template>
    <div class="container py-4">

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">
                {{ t('cart.title') }}
            </h2>
        </div>

        <div
            v-if="cartStore.loading"
            class="alert alert-light border text-center py-4"
        >
            {{ t('cart.loading') }}
        </div>

        <div
            v-else-if="!Object.keys(items).length"
            class="card border-0 shadow-sm"
        >
            <div class="card-body text-center py-5">

                <h4 class="mb-2">
                    {{ t('cart.emptyTitle') }}
                </h4>

                <p class="text-muted mb-4">
                    {{ t('cart.emptyText') }}
                </p>

                <NuxtLink
                    :to="localePath('/catalog')"
                    class="btn btn-primary px-4"
                >
                    {{ t('cart.goToCatalog') }}
                </NuxtLink>

            </div>
        </div>

        <div
            v-else
            class="row g-4 align-items-start"
        >

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

                                    <NuxtLink :to="localePath(`/catalog/show/${itemData.id}`)">
                                        <img
                                            :src="itemData.photo_url || '/images/default_car.jpg'"
                                            class="rounded border"
                                            style="width:110px;height:80px;object-fit:contain;"
                                        />
                                    </NuxtLink>

                                    <div>

                                        <NuxtLink
                                            :to="localePath(`/catalog/show/${itemData.id}`)"
                                            class="text-decoration-none text-dark"
                                        >
                                            <h5 class="mb-1">
                                                {{ itemData.name }}
                                            </h5>
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
                                        :disabled="isLocked || getQty(itemId) <= 1 || cartStore.loadingUpdate"
                                        @click="updateQtyLocal(itemId, getQty(itemId) - 1)"
                                    >
                                        −
                                    </button>

                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        pattern="[0-9]*"
                                        class="form-control text-center"
                                        style="width:90px;"
                                        :value="getQty(itemId)"
                                        :disabled="isLocked || cartStore.loadingUpdate"
                                        @keydown="preventInvalidQtyKeys"
                                        @paste.prevent="updateQtyLocal(itemId, ($event.clipboardData as DataTransfer).getData('text'))"
                                        @input="updateQtyLocal(itemId, ($event.target as HTMLInputElement).value)"
                                    />

                                    <button
                                        type="button"
                                        class="btn btn-outline-secondary btn-sm"
                                        :disabled="isLocked || cartStore.loadingUpdate"
                                        @click="updateQtyLocal(itemId, getQty(itemId) + 1)"
                                    >
                                        +
                                    </button>

                                </div>

                            </div>

                            <div class="col-8 col-md-3 text-md-end">

                                <div class="fw-bold fs-5">
                                    {{ formatPrice(itemData.price * (getQty(itemId) || itemData.qty)) }}
                                </div>

                            </div>

                            <div class="col-4 col-md-1 text-end">

                                <button
                                    type="button"
                                    class="btn btn-outline-danger btn-sm"
                                    :disabled="isLocked || cartStore.loadingRemove"
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

                            <span class="text-muted">
                                {{ t('cart.total') }}:
                            </span>

                            <span class="fs-4 fw-bold text-success">
                                {{ formatPrice(total) }}
                            </span>

                        </div>

                        <hr>

                        <div class="d-flex justify-content-between">

                            <span class="text-muted">
                                {{ t('cart.items') }}:
                            </span>

                            <span class="fw-semibold">
                                {{ Object.keys(items).length }}
                            </span>

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
                            :disabled="isLocked"
                        />

                    </div>

                </div>

                <div class="card border-0 shadow-sm">

                    <div class="card-body d-grid gap-3">

                        <BaseButton
                            :variant="!hasChanges ? 'secondary' : 'primary'"
                            class="w-100 fw-semibold transition-all"
                            :disabled="isLocked || cartStore.loadingUpdate || !hasChanges"
                            :class="{
                                'opacity-50': !hasChanges,
                                'cursor-not-allowed': !hasChanges
                            }"
                            @click="applyCartUpdates"
                        >
                            {{ t('cart.updateCart') }}
                        </BaseButton>

                        <BaseButton
                            variant="outline-danger"
                            class="w-100"
                            :disabled="isLocked || cartStore.loadingClear || !Object.keys(items).length"
                            @click="openClearModal"
                        >
                            {{ t('cart.clear') }}
                        </BaseButton>

                        <BaseButton
                            variant="success"
                            size="lg"
                            class="w-100 py-3 fw-semibold mt-3"
                            :loading="isSubmitting"
                            :disabled="isLocked"
                            @click="openCheckoutModal"
                        >
                            {{ t('cart.checkout') }}
                        </BaseButton>

                    </div>

                </div>

            </div>

        </div>

        <CartRemoveItemModal
            :show="showRemoveModal"
            :processing="cartStore.loadingRemove"
            @close="showRemoveModal = false"
            @confirm="confirmRemoveItem"
        />

        <CartCheckoutModal
            :show="showCheckoutModal"
            :processing="isSubmitting"
            @close="showCheckoutModal = false"
            @confirm="confirmCheckout"
        />

        <CartClearModal
            :show="showClearModal"
            :processing="cartStore.loadingClear"
            @close="showClearModal = false"
            @confirm="confirmClearCart"
        />

    </div>
</template>
