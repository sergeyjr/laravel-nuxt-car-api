<script setup lang="ts">

import {computed} from 'vue'

const props = defineProps<{
    show: boolean
    loading: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm'): void
}>()

const isProcessing = computed(() => props.loading)

const close = () => {
    if (isProcessing.value) {
        return
    }
    emit('close')
}

const confirmLogout = () => {
    if (isProcessing.value) {
        return
    }
    emit('confirm')
}

</script>

<template>
    <div
        class="modal fade show d-block"
        tabindex="-1"
        v-if="show"
        style="background: rgba(0,0,0,.5);"
        @click.self="close"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Выход из аккаунта</h5>
                    <button
                        type="button"
                        class="btn-close"
                        :disabled="isProcessing"
                        @click="close"
                    ></button>
                </div>

                <div class="modal-body">
                    <p class="mb-0">Вы уверены, что хотите выйти?</p>
                </div>

                <div class="modal-footer">

                    <BaseButton
                        variant="danger"
                        :disabled="isProcessing"
                        @click="confirmLogout"
                    >
                        <span v-if="isProcessing">
                            Выходим...
                        </span>
                        <span v-else>
                            Выйти
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
