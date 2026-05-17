<script setup lang="ts">

const props = defineProps<{
    show: boolean
    isProcessing?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm'): void
}>()

const close = () => {
    if (props.isProcessing) {
        return
    }
    emit('close')
}

const confirm = () => {
    if (props.isProcessing) {
        return
    }
    emit('confirm')
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
                        Очистка корзины
                    </h5>

                    <BaseButton
                        variant="link"
                        class="btn-close"
                        :disabled="isProcessing"
                        aria-label="Close"
                        @click="close"
                    />
                </div>

                <div class="modal-body">
                    <p class="mb-0">
                        Очистить всю корзину?<br>
                        Все товары будут удалены без возможности восстановления.
                    </p>
                </div>

                <div class="modal-footer">

                    <BaseButton
                        variant="danger"
                        :disabled="isProcessing"
                        @click="confirm"
                    >
                        <span v-if="isProcessing">
                            Очищаем...
                        </span>

                        <span v-else>
                            Очистить
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
