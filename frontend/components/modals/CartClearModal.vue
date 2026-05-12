<script setup lang="ts">

import {computed} from 'vue'
import {useCartStore} from '~/stores/cart'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])

const cart = useCartStore()

const isProcessing = computed(() => cart.loadingClear)

const close = () => {
    if (!isProcessing.value) emit('close')
}

const confirmClear = async () => {
    await cart.clear()
    close()
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
                    <h5 class="modal-title text-warning">
                        Очистка корзины
                    </h5>

                    <button class="btn-close" @click="close" :disabled="isProcessing"/>
                </div>

                <div class="modal-body">
                    <p class="mb-0">
                        Очистить всю корзину?<br>
                        Все товары будут удалены без возможности восстановления.
                    </p>
                </div>

                <div class="modal-footer">

                    <BaseButton variant="warning" :disabled="isProcessing" @click="confirmClear">
                        <span v-if="isProcessing">Очищаем...</span>
                        <span v-else>Очистить</span>
                    </BaseButton>

                    <BaseButton variant="secondary" :disabled="isProcessing" @click="close">
                        Отмена
                    </BaseButton>

                </div>

            </div>
        </div>
    </div>
</template>
