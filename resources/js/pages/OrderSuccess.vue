<script setup>

import {useRoute, useRouter} from 'vue-router'
import {onMounted, computed} from 'vue'
import {useOrderStore} from '@/stores/orderStore'

const route = useRoute()
const router = useRouter()
const store = useOrderStore()

const orderId = computed(() => route.params.id)

const order = computed(() => store.currentOrder)

onMounted(async () => {
    if (!orderId.value) {
        router.push('/')
        return
    }

    await store.fetchOrder(orderId.value)
})

</script>

<template>
    <div class="container mt-5 text-center">

        <div class="card shadow-sm border-0 p-4">

            <h1 class="text-success mb-3">Спасибо за заказ!</h1>

            <p class="mb-3">
                Ваш заказ успешно оформлен.
            </p>

            <div v-if="order">
                <h5>Номер заказа: #{{ order.id }}</h5>
                <h4 class="text-primary mt-2">
                    Итого: {{ new Intl.NumberFormat('ru-RU').format(order.total) }} ₽
                </h4>

                <p class="text-muted mt-2">
                    Статус: {{ order.status }}
                </p>
            </div>

            <div class="mt-4 d-flex gap-2 justify-content-center">
                <router-link to="/cars" class="btn btn-outline-secondary">
                    Продолжить покупки
                </router-link>

                <router-link to="/orders" class="btn btn-success">
                    Мои заказы
                </router-link>
            </div>

        </div>

    </div>
</template>
