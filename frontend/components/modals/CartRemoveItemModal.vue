<script setup lang="ts">

import {computed} from 'vue'
import {useCartStore} from '~/stores/cart'

const props = defineProps<{
    show: boolean
    productId: number | null
}>()

const emit = defineEmits(['close'])

const cart = useCartStore()

const isProcessing = computed(() => cart.loadingRemove)

const close = () => {
    if (!isProcessing.value) emit('close')
}

const confirmDelete = async () => {
    if (!props.productId) return
    await cart.remove(props.productId)
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
                    <h5 class="modal-title text-danger">
                        Удаление товара
                    </h5>

                    <button class="btn-close" @click="close" :disabled="isProcessing"/>
                </div>

                <div class="modal-body">
                    <p class="mb-0">
                        Удалить товар из корзины?<br>
                        Действие можно отменить только вручную.
                    </p>
                </div>

                <div class="modal-footer">

                    <BaseButton variant="danger" :disabled="isProcessing" @click="confirmDelete">
                        <span v-if="isProcessing">Удаляем...</span>
                        <span v-else>Удалить</span>
                    </BaseButton>

                    <BaseButton variant="secondary" :disabled="isProcessing" @click="close">
                        Отмена
                    </BaseButton>

                </div>

            </div>
        </div>
    </div>
</template>
