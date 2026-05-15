<script setup lang="ts">

import {computed} from 'vue'

import BaseButton from '~/components/BaseButton.vue'

const props = defineProps<{
    show: boolean
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm'): void
}>()

const isProcessing = computed(() => props.loading)

const close = () => {
    if (!isProcessing.value) {
        emit('close')
    }
}

const confirmDelete = () => {
    if (!isProcessing.value) {
        emit('confirm')
    }
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
                        Удаление аккаунта
                    </h5>

                    <button
                        type="button"
                        class="btn-close"
                        :disabled="isProcessing"
                        @click="close"
                    />
                </div>

                <div class="modal-body">
                    <p class="mb-0">
                        Вы уверены, что хотите удалить аккаунт?<br>
                        Это действие <strong>нельзя отменить</strong>.
                    </p>
                </div>

                <div class="modal-footer">

                    <BaseButton
                        variant="danger"
                        :disabled="isProcessing"
                        @click="confirmDelete"
                    >
                        <span v-if="isProcessing">
                            Удаляем...
                        </span>
                        <span v-else>
                            Удалить
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
