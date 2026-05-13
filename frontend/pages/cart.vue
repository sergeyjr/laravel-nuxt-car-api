<script setup lang="ts">

import {computed, ref} from 'vue'

import {useCartStore} from '~/stores/cart'

import BaseTextarea from '~/components/BaseTextarea.vue'
import BaseButton from '~/components/BaseButton.vue'

import CartRemoveItemModal from '~/components/modals/CartRemoveItemModal.vue'
import CartCheckoutModal from '~/components/modals/CartCheckoutModal.vue'
import CartClearModal from '~/components/modals/CartClearModal.vue'

const cart = useCartStore()

const isSubmitting = ref(false)
const comment = ref('')

const showRemoveModal = ref(false)
const showCheckoutModal = ref(false)
const showClearModal = ref(false)

const selectedItemId = ref<number | null>(null)

const items = computed(() => cart.items)
const total = computed(() => cart.total)

const formatPrice = (v: number) =>
    new Intl.NumberFormat('ru-RU').format(v) + ' ₽'

function sanitizeQty(value: unknown) {
    let qty = Number(value)
    if (!Number.isInteger(qty)) qty = Math.floor(qty)
    if (Number.isNaN(qty) || qty < 1) qty = 1
    return qty
}

function openRemoveModal(id: number | string) {
    selectedItemId.value = Number(id)
    showRemoveModal.value = true
}

function openClearModal() {
    showClearModal.value = true
}

function openCheckoutModal() {
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
    try {
        isSubmitting.value = true

        const res: any = await cart.checkout({
            comment: comment.value
        })

        console.log('checkout response', res)

        const order = res?.data?.order

        if (!order?.id) {
            throw new Error('Order ID missing in response')
        }

        // обновляем dashboard
        const dashboard = useDashboardStore()
        await dashboard.fetchDashboard(true)

        showCheckoutModal.value = false

        return navigateTo(`/order-success/${order.id}`)

    } catch (e) {
        console.error('Checkout failed:', e)
    } finally {
        isSubmitting.value = false
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
    <div class="container py-4">
        <!-- HEADER -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Корзина</h2>

            <button
                type="button"
                class="btn btn-outline-secondary"
                @click="goBack"
            >
                ← Назад
            </button>
        </div>

        <!-- LOADING -->
        <div v-if="cart.loading" class="alert alert-light border text-center py-4">
            Загрузка корзины...
        </div>

        <!-- EMPTY -->
        <div
            v-else-if="!Object.keys(items).length"
            class="card border-0 shadow-sm"
        >
            <div class="card-body text-center py-5">
                <h4 class="mb-2">Корзина пуста</h4>
                <p class="text-muted mb-4">Вы ещё не добавили товары</p>

                <NuxtLink to="/cars" class="btn btn-primary px-4">
                    Перейти в каталог
                </NuxtLink>
            </div>
        </div>

        <!-- CONTENT -->
        <div v-else class="row g-4 align-items-start">
            <!-- ITEMS -->
            <div class="col-12 col-lg-8">
                <div
                    v-for="(itemData, itemId) in items"
                    :key="itemId"
                    class="card border-0 shadow-sm mb-3"
                >
                    <div class="card-body">
                        <div class="row align-items-center g-3">
                            <!-- IMAGE + INFO -->
                            <div class="col-12 col-md-5">
                                <div class="d-flex align-items-center gap-3">
                                    <NuxtLink :to="`/cars/show/${itemData.id}`">
                                        <img
                                            :src="itemData.photo_url || '/images/default_car.jpg'"
                                            alt=""
                                            class="rounded border"
                                            style="width:110px;height:80px;object-fit:contain;"
                                        />
                                    </NuxtLink>

                                    <div>
                                        <NuxtLink
                                            :to="`/cars/show/${itemData.id}`"
                                            class="text-decoration-none text-dark"
                                        >
                                            <h5 class="mb-1">
                                                {{ itemData.name }}
                                            </h5>
                                        </NuxtLink>

                                        <div class="text-muted small">
                                            {{ formatPrice(itemData.price) }} / шт
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- QTY -->
                            <div class="col-12 col-md-3">
                                <div class="d-flex justify-content-center align-items-center gap-2">
                                    <button
                                        type="button"
                                        class="btn btn-outline-secondary btn-sm"
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

                            <!-- PRICE -->
                            <div class="col-8 col-md-3 text-md-end">
                                <div class="fw-bold fs-5">
                                    {{ formatPrice(itemData.price * itemData.qty) }}
                                </div>
                            </div>

                            <!-- REMOVE -->
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

            <!-- SIDEBAR -->
            <div class="col-12 col-lg-4">
                <div class="position-lg-sticky" style="top: 1rem;">
                    <!-- TOTAL -->
                    <div class="card border-0 shadow-sm mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="text-muted">Итого:</span>
                                <span class="fs-4 fw-bold text-success">
                                    {{ formatPrice(total) }}
                                </span>
                            </div>

                            <hr>

                            <div class="d-flex justify-content-between mb-0">
                                <span class="text-muted">Позиций:</span>
                                <span class="fw-semibold">{{ Object.keys(items).length }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- COMMENT -->
                    <div class="card border-0 shadow-sm mb-3">
                        <div class="card-body">
                            <label class="form-label fw-semibold">
                                Комментарий к заказу:
                            </label>

                            <BaseTextarea
                                v-model="comment"
                                :rows="5"
                                placeholder="Например: позвонить перед доставкой"
                                :disabled="isSubmitting"
                            />
                        </div>
                    </div>

                    <!-- ACTIONS -->
                    <div class="card border-0 shadow-sm">
                        <div class="card-body d-grid gap-2">
                            <BaseButton
                                variant="success"
                                size="lg"
                                class="w-100 py-3 fw-semibold"
                                :loading="isSubmitting"
                                @click="openCheckoutModal"
                            >
                                Отправить заказ

                                <template #loading>
                                    Отправляем заказ...
                                </template>
                            </BaseButton>

                            <BaseButton
                                variant="outline-danger"
                                class="w-100"
                                :disabled="isSubmitting || !Object.keys(items).length"
                                @click="openClearModal"
                            >
                                Очистить корзину
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODALS -->
        <CartRemoveItemModal
            :show="showRemoveModal"
            :product-id="selectedItemId"
            @close="showRemoveModal = false"
            @success="confirmRemoveItem"
        />

        <CartCheckoutModal
            :show="showCheckoutModal"
            @close="showCheckoutModal = false"
            @success="confirmCheckout"
        />

        <CartClearModal
            :show="showClearModal"
            @close="showClearModal = false"
            @success="confirmClearCart"
        />
    </div>
</template>
