<script setup lang="ts">

import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import BaseButton from '~/components/BaseButton.vue'

const router = useRouter()
const cart = useCartStore()

const isLoading = ref(true)
const isSubmitting = ref(false)
const comment = ref('')

onMounted(async () => {
    await cart.fetch()
    isLoading.value = false
})

const items = computed(() => cart.items)
const total = computed(() => cart.total)

const hasItems = computed(() =>
    Object.keys(items.value || {}).length > 0
)

// =========================
// QTY SAFE LOGIC
// =========================
function sanitizeQty(value: number | string) {
    let qty = Number(value)

    if (!Number.isInteger(qty)) {
        qty = Math.floor(qty)
    }

    if (isNaN(qty) || qty < 1) {
        qty = 1
    }

    return qty
}

function updateQty(id: string | number, qty: number) {
    cart.update(id, sanitizeQty(qty))
}

function updateInput(id: string | number, event: Event) {
    const target = event.target as HTMLInputElement
    const qty = sanitizeQty(target.value)
    cart.update(id, qty)
}

// =========================
// ACTIONS
// =========================
function remove(id: string | number) {
    if (confirm('Удалить этот товар из корзины?')) {
        cart.remove(id)
    }
}

function clear() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        cart.clear()
    }
}

// =========================
// CHECKOUT
// =========================
const submitOrder = async () => {
    if (!confirm('Вы уверены, что хотите отправить заказ?')) return

    try {
        isSubmitting.value = true

        const res = await cart.checkout({
            comment: comment.value
        })

        router.push(`/order-success/${res.order.id}`)

    } catch (e) {
        console.error('Checkout error:', e)
    } finally {
        isSubmitting.value = false
    }
}

</script>

<template>
    <div class="container mt-4">

        <!-- HEADER -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Корзина</h2>

            <button
                v-if="hasItems"
                class="btn btn-outline-danger"
                @click="clear"
            >
                Очистить
            </button>
        </div>

        <!-- LOADING -->
        <div v-if="isLoading" class="alert alert-light">
            Загрузка корзины...
        </div>

        <!-- EMPTY -->
        <div v-else-if="!hasItems" class="alert alert-light text-center py-5">
            <h5 class="mb-2">Корзина пуста</h5>
            <p class="text-muted mb-3">
                Вы ещё не добавили товары в корзину.
            </p>

            <NuxtLink to="/cars" class="btn btn-primary">
                Перейти в каталог
            </NuxtLink>
        </div>

        <!-- ITEMS -->
        <div v-else class="row g-3">

            <div
                v-for="(itemData, itemId) in items"
                :key="itemId"
                class="col-12"
            >
                <div class="card shadow-sm border-0">
                    <div class="card-body cart-row">

                        <!-- ITEM -->
                        <div class="d-flex align-items-center gap-3">

                            <NuxtLink :to="`/cars/show/${itemData.id}`">
                                <img
                                    :src="itemData.photo_url || '/images/default_car.jpg'"
                                    style="width: 100px; height: 70px; object-fit: contain; border-radius: 6px;"
                                />
                            </NuxtLink>

                            <div>
                                <NuxtLink
                                    :to="`/cars/show/${itemData.id}`"
                                    class="text-decoration-none text-dark"
                                >
                                    <h5 class="mb-1">{{ itemData.name }}</h5>
                                </NuxtLink>

                                <div class="text-muted">
                                    {{ new Intl.NumberFormat('ru-RU').format(itemData.price) }} ₽ / шт
                                </div>
                            </div>

                        </div>

                        <!-- QTY -->
                        <div class="d-flex align-items-center gap-2 justify-content-center">

                            <button
                                class="btn btn-outline-secondary btn-sm"
                                @click="updateQty(itemId, itemData.qty - 1)"
                            >
                                −
                            </button>

                            <input
                                type="number"
                                min="1"
                                class="form-control form-control-sm text-center"
                                style="width: 80px;"
                                :value="itemData.qty"
                                @input="updateInput(itemId, $event)"
                            />

                            <button
                                class="btn btn-outline-secondary btn-sm"
                                @click="updateQty(itemId, itemData.qty + 1)"
                            >
                                +
                            </button>

                        </div>

                        <!-- PRICE -->
                        <div class="fw-bold text-end">
                            {{ new Intl.NumberFormat('ru-RU').format(itemData.price * itemData.qty) }} ₽
                        </div>

                        <!-- REMOVE -->
                        <button
                            class="btn btn-outline-danger btn-sm"
                            @click="remove(itemId)"
                        >
                            X
                        </button>

                    </div>
                </div>
            </div>
        </div>

        <!-- TOTAL -->
        <div v-if="hasItems" class="mt-4">

            <div class="card border-0 shadow-sm mb-3">
                <div class="card-body d-flex justify-content-between">
                    <h4>Итого:</h4>
                    <h4 class="text-success">
                        {{ new Intl.NumberFormat('ru-RU').format(total) }} ₽
                    </h4>
                </div>
            </div>

            <div class="card border-0 shadow-sm mb-3">
                <div class="card-body">

                    <label class="form-label">Комментарий</label>

                    <textarea
                        v-model="comment"
                        class="form-control"
                        rows="3"
                        :disabled="isSubmitting"
                    />

                </div>
            </div>

            <BaseButton
                variant="success"
                :loading="isSubmitting"
                @click="submitOrder"
            >
                Отправить заказ

                <template #loading>
                    Отправляем заказ...
                </template>
            </BaseButton>

        </div>

    </div>
</template>

<style scoped>
.cart-row {
    display: grid;
    grid-template-columns: 1fr 160px 140px 40px;
    align-items: center;
    gap: 16px;
}
</style>
