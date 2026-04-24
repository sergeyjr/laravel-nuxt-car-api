<script setup>

import {onMounted, computed, ref} from "vue";
import {useCartStore} from "@/stores/cartStore";

const cart = useCartStore();
const isLoading = ref(true);

onMounted(async () => {
    await cart.fetch();
    isLoading.value = false;
});

const items = computed(() => cart.items);
const total = computed(() => cart.total);

function updateQty(id, qty) {
    if (!isNaN(qty) && qty >= 1) {
        cart.update(id, qty)
    }
}

function updateInput(id, event) {
    const qty = parseInt(event.target.value, 10)
    if (!isNaN(qty) && qty >= 1) {
        cart.update(id, qty)
    }
}

function remove(id) {
    cart.remove(id);
}

function clear() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        cart.clear();
    }
}

</script>

<template>
    <div class="container mt-4">

        <!-- HEADER -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Корзина</h2>

            <button
                class="btn btn-outline-danger"
                @click="clear"
                v-if="Object.keys(items).length"
            >
                Очистить
            </button>
        </div>

        <!-- LOADING / EMPTY -->
        <div v-if="isLoading" class="alert alert-light">
            Загрузка корзины...
        </div>
        <div v-else-if="!Object.keys(items).length" class="alert alert-light">
            Корзина пуста
        </div>

        <!-- ITEMS -->
        <div v-else class="row g-3">
            <div
                v-for="(itemData, itemId) in items"
                :key="itemId"
                class="col-12"
            >
                <div class="card shadow-sm border-0">
                    <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">

                        <div class="d-flex align-items-center gap-3 flex-grow-1">

                            <router-link :to="`/cars/show/${itemData.id}`">
                                <img
                                    :src="itemData.photo_url || '/images/default_car.jpg'"
                                    style="width: 100px; height: 70px; object-fit: contain; border-radius: 6px;"
                                    alt=""
                                />
                            </router-link>

                            <div>
                                <router-link
                                    :to="`/cars/show/${itemData.id}`"
                                    class="text-decoration-none text-dark"
                                >
                                    <h5 class="mb-1">{{ itemData.name }}</h5>
                                </router-link>

                                <div class="text-muted">
                                    {{ new Intl.NumberFormat('ru-RU').format(itemData.price) }} ₽ / шт
                                </div>
                            </div>

                        </div>

                        <!-- QTY -->
                        <div class="d-flex align-items-center gap-2">
                            <button
                                class="btn btn-outline-secondary btn-sm"
                                @click="updateQty(itemId, itemData.qty - 1)"
                            >
                                −
                            </button>

                            <input
                                type="text"
                                class="form-control form-control-sm text-center"
                                style="width: 70px;"
                                :value="itemData.qty"
                                @input="updateInput(itemId, $event)"
                                min="1"
                            />

                            <button
                                class="btn btn-outline-secondary btn-sm"
                                @click="updateQty(itemId, itemData.qty + 1)"
                            >
                                +
                            </button>
                        </div>

                        <!-- PRICE -->
                        <div class="fw-bold">
                            {{ new Intl.NumberFormat('ru-RU').format(itemData.price * itemData.qty) }} ₽
                        </div>

                        <!-- REMOVE -->
                        <button
                            class="btn btn-outline-danger btn-sm"
                            @click="remove(itemId)"
                        >
                            Удалить
                        </button>

                    </div>
                </div>
            </div>
        </div>

        <!-- TOTAL -->
        <div v-if="Object.keys(items).length" class="mt-4">
            <div class="card border-0 shadow-sm">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">Итого:</h4>
                    <h4 class="mb-0 text-success">
                        {{ new Intl.NumberFormat('ru-RU').format(total) }} ₽
                    </h4>
                </div>
            </div>
        </div>

    </div>
</template>
