<script setup lang="ts">

import {computed} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const localePath = useLocalePath()

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
                        {{ t('modals.cartItemDelete.title') }}
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
                        {{ t('modals.cartItemDelete.textLine1') }}<br>
                        {{ t('modals.cartItemDelete.textLine2') }}
                    </p>
                </div>

                <div class="modal-footer">

                    <BaseButton
                        variant="danger"
                        :disabled="props.isProcessing"
                        @click="confirm"
                    >
                        <span v-if="props.isProcessing">
                            {{ t('modals.cartItemDelete.deleting') }}
                        </span>

                        <span v-else>
                            {{ t('modals.cartItemDelete.confirm') }}
                        </span>
                    </BaseButton>

                    <BaseButton
                        variant="secondary"
                        :disabled="props.isProcessing"
                        @click="close"
                    >
                        {{ t('common.cancel') }}
                    </BaseButton>

                </div>

            </div>
        </div>
    </div>
</template>
