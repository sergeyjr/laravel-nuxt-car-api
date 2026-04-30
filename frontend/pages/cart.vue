<script setup>

import {computed, ref} from 'vue'
import {useCartStore} from '~/stores/cart'
import BaseButton from '~/components/BaseButton.vue'

const cart = useCartStore()

await callOnce(() => cart.fetch())

const isSubmitting = ref(false)
const comment = ref('')

const items = computed(() => cart.items)
const total = computed(() => cart.total)

const formatPrice = (v) =>
    new Intl.NumberFormat('ru-RU').format(v) + ' ₽'

function sanitizeQty(value) {
    let qty = Number(value)

    if (!Number.isInteger(qty)) qty = Math.floor(qty)
    if (isNaN(qty) || qty < 1) qty = 1

    return qty
}

function updateQty(id, qty) {
    cart.update(id, sanitizeQty(qty))
}

function updateInput(id, event) {
    const qty = sanitizeQty(event.target.value)
    cart.update(id, qty)
}

function remove(id) {
    if (confirm('Удалить товар из корзины?')) {
        cart.remove(id)
    }
}

function clear() {
    if (confirm('Очистить корзину?')) {
        cart.clear()
    }
}

const submitOrder = async () => {
    if (!confirm('Отправить заказ?')) return

    try {
        isSubmitting.value = true

        const res = await cart.checkout({
            comment: comment.value
        })

        return navigateTo(`/order-success/${res.order.id}`)

    } catch (e) {
        console.error(e)
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
                v-if="Object.keys(items).length"
                class="btn btn-outline-danger"
                @click="clear"
            >
                Очистить
            </button>
        </div>

        <!-- LOADING -->
        <div v-if="cart.loading" class="alert alert-light">
            Загрузка корзины...
        </div>

        <!-- EMPTY -->
        <div
            v-else-if="!Object.keys(items).length"
            class="alert alert-light text-center py-5"
        >
            <h5 class="mb-2">Корзина пуста</h5>
            <p class="text-muted mb-3">
                Вы ещё не добавили товары
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

                        <!-- INFO -->
                        <div class="d-flex align-items-center gap-3">

                            <NuxtLink :to="`/cars/show/${itemData.id}`">
                                <img
                                    :src="itemData.photo_url || '/images/default_car.jpg'"
                                    style="width:100px;height:70px;object-fit:contain;border-radius:6px;"
                                    alt=""/>
                            </NuxtLink>

                            <div>
                                <NuxtLink
                                    :to="`/cars/show/${itemData.id}`"
                                    class="text-decoration-none text-dark"
                                >
                                    <h5 class="mb-1">{{ itemData.name }}</h5>
                                </NuxtLink>

                                <div class="text-muted">
                                    {{ formatPrice(itemData.price) }} / шт
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
                                style="width:80px;"
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
                            {{ formatPrice(itemData.price * itemData.qty) }}
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
        <div v-if="Object.keys(items).length" class="mt-4">

            <div class="card border-0 shadow-sm mb-3">
                <div class="card-body d-flex justify-content-between">
                    <h4 class="mb-0">Итого:</h4>
                    <h4 class="mb-0 text-success">
                        {{ formatPrice(total) }}
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
                    Отправляем...
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
