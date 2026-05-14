<script setup lang="ts">

import {computed} from 'vue'
import {useCartStore} from '~/stores/cart'

defineProps<{
    show: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'success'): void
}>()

const cart = useCartStore()

const isProcessing = computed(() => {
    return cart.loadingCheckout
})

const close = () => {
    if (isProcessing.value) {
        return
    }
    emit('close')
}

const confirmOrder = () => {
    if (isProcessing.value) {
        return
    }
    emit('success')
}

</script>

<template>
    <div
        v-if="show"
        class="modal fade show d-block"
        tabindex="-1"
        style="background: rgba(0,0,0,.6);"
        @click.self="close"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title text-primary">
                        Оформление заказа
                    </h5>

                    <button
                        class="btn-close"
                        @click="close"
                        :disabled="isProcessing"
                    />

                </div>

                <div class="modal-body">
                    <p class="mb-0">
                        Подтвердить отправку заказа?<br>
                        После отправки корзина будет очищена.
                    </p>
                </div>

                <div class="modal-footer">

                    <BaseButton
                        variant="primary"
                        :disabled="isProcessing"
                        @click="confirmOrder"
                    >
                        <span v-if="isProcessing">
                            Отправка...
                        </span>

                        <span v-else>
                            Подтвердить
                        </span>
                    </BaseButton>

                    <BaseButton
                        variant="secondary"
                        :disabled="isProcessing"
                        @click="close"
                    >
                        Отмена
                    </BaseButton>

                </div>

            </div>
        </div>
    </div>
</template>
