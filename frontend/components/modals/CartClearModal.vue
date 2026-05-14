<script setup lang="ts">

const props = defineProps<{
    show: boolean
    processing?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm'): void
}>()

const close = () => {
    if (props.processing) {
        return
    }
    emit('close')
}

const confirm = () => {
    if (props.processing) {
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
                    <h5 class="modal-title text-warning">
                        Очистка корзины
                    </h5>

                    <button
                        type="button"
                        class="btn-close"
                        :disabled="processing"
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
                        variant="warning"
                        :disabled="processing"
                        @click="confirm"
                    >
                        <span v-if="processing">
                            Очищаем...
                        </span>

                        <span v-else>
                            Очистить
                        </span>
                    </BaseButton>

                    <BaseButton
                        variant="secondary"
                        :disabled="processing"
                        @click="close"
                    >
                        Отмена
                    </BaseButton>

                </div>

            </div>
        </div>
    </div>
</template>
