<script setup>

import {useRoute, useRouter} from 'vue-router'
import {onMounted, computed} from 'vue'
import {useOrderStore} from '@/stores/orderStore'

const route = useRoute()
const router = useRouter()
const store = useOrderStore()

const orderId = computed(() => route.params.id)
const order = computed(() => store.currentOrder)

const statusLabel = (status) => {
    const map = {
        pending_payment: 'Ожидает оплаты',
        processing: 'В обработке',
        packed: 'Собран',
        shipped: 'Отправлен',
        completed: 'Завершён',
        cancelled: 'Отменён',
        refunded: 'Возврат'
    }
    return map[status] || status
}

const formatPrice = (price) =>
    new Intl.NumberFormat('ru-RU').format(price)

onMounted(async () => {
    if (!orderId.value) {
        router.push('/')
        return
    }

    await store.fetchOrder(orderId.value)
})

</script>

<template>
    <div class="container py-5">

        <!-- MAIN CARD -->
        <div class="checkout-card mx-auto">

            <!-- HEADER -->
            <div class="text-center mb-4">

                <div class="success-icon mb-3">✔</div>

                <h2 class="fw-bold mb-2">
                    Заказ успешно оформлен
                </h2>

                <p class="text-muted mb-0">
                    Мы отправили подтверждение и начали обработку заказа
                </p>

            </div>

            <!-- LOADING -->
            <div v-if="!order" class="text-center text-muted py-5">
                Загрузка заказа...
            </div>

            <!-- CONTENT -->
            <div v-else>

                <!-- ORDER INFO -->
                <div class="order-meta">

                    <div>
                        <div class="text-muted small">Номер заказа</div>
                        <div class="fw-bold">#{{ order.id }}</div>
                    </div>

                    <div class="text-end">
                        <div class="text-muted small">Сумма</div>
                        <div class="fw-bold text-primary fs-5">
                            {{ formatPrice(order.total) }} ₽
                        </div>
                    </div>

                </div>

                <!-- STATUS -->
                <div class="mt-3 mb-4 text-center">
                    <span class="status-pill"
                          :class="order.status">
                        {{ statusLabel(order.status) }}
                    </span>
                </div>

                <!-- ITEMS -->
                <div v-if="order.items?.length" class="items-grid">

                    <div
                        v-for="item in order.items"
                        :key="item.id"
                        class="item-card"
                    >

                        <div class="item-name">
                            {{ item.name || ('Товар #' + item.car_id) }}
                        </div>

                        <div class="item-meta">
                            {{ formatPrice(item.price) }} ₽ × {{ item.qty }}
                        </div>

                        <div class="item-total">
                            {{ formatPrice(item.price * item.qty) }} ₽
                        </div>

                    </div>

                </div>

                <!-- COMMENT -->
                <div v-if="order.comment" class="comment-box mt-4">
                    <div class="text-muted small mb-1">Комментарий</div>
                    <div>{{ order.comment }}</div>
                </div>

                <!-- ACTIONS -->
                <div class="actions mt-4">
                    <router-link to="/cars" class="btn btn-outline-secondary">
                        Продолжить покупки
                    </router-link>

                    <router-link to="/orders" class="btn btn-primary">
                        Мои заказы
                    </router-link>
                </div>

            </div>

        </div>

    </div>
</template>

<style scoped>

.checkout-card {
    max-width: 720px;
    background: #fff;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.08);
}

.success-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto;
    border-radius: 50%;
    background: #e8fff1;
    color: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: bold;
}

.order-meta {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    background: #f8fafc;
    border-radius: 12px;
}

.items-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
}

.item-card {
    display: flex;
    justify-content: space-between;
    padding: 12px 14px;
    border-radius: 12px;
    background: #f9fafb;
    transition: 0.2s;
}

.item-card:hover {
    background: #f3f4f6;
}

.item-name {
    font-weight: 600;
}

.item-meta {
    font-size: 12px;
    color: #6b7280;
}

.item-total {
    font-weight: bold;
    color: #2563eb;
}

.comment-box {
    padding: 12px;
    background: #f8fafc;
    border-radius: 12px;
    font-size: 14px;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.status-pill {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
}

/* STATUS COLORS */
.status-pill.pending_payment { background: #fef3c7; color: #92400e; }
.status-pill.processing { background: #e0f2fe; color: #075985; }
.status-pill.packed { background: #ede9fe; color: #5b21b6; }
.status-pill.shipped { background: #dbeafe; color: #1d4ed8; }
.status-pill.completed { background: #dcfce7; color: #166534; }
.status-pill.cancelled { background: #fee2e2; color: #991b1b; }
.status-pill.refunded { background: #e5e7eb; color: #374151; }

</style>
