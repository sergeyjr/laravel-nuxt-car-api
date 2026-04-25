<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'

const route = useRoute()
const store = useOrderStore()

const order = computed(() => store.currentOrder)

onMounted(async () => {
    await store.fetchOrder(route.params.id)
})
</script>

<template>
    <div class="container mt-4">

        <div v-if="!order">
            Загрузка...
        </div>

        <div v-else>

            <h2>Заказ #{{ order.id }}</h2>

            <p class="text-muted">
                Статус:
                <span class="badge bg-primary">{{ order.status }}</span>
            </p>

            <hr>

            <div class="row g-3">

                <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="col-12"
                >
                    <div class="d-flex justify-content-between border-bottom pb-2">

                        <div>
                            <strong>Машина ID: {{ item.car_id }}</strong><br>
                            <small class="text-muted">
                                {{ item.qty }} × {{ item.price }} ₽
                            </small>
                        </div>

                        <div class="fw-bold">
                            {{ item.qty * item.price }} ₽
                        </div>

                    </div>
                </div>

            </div>

            <hr>

            <h4 class="text-success">
                Итого: {{ order.total }} ₽
            </h4>

        </div>

    </div>
</template>
