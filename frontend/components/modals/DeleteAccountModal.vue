<script setup lang="ts">

import {computed} from 'vue'
import {useI18n} from 'vue-i18n'

import BaseButton from '~/components/BaseButton.vue'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

const props = defineProps<{
    show: boolean
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm'): void
}>()

const isProcessing = computed(() => !!props.loading)

const close = () => {
    if (isProcessing.value) {
        return
    }

    emit('close')
}

const confirmDelete = () => {
    if (isProcessing.value) {
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
                        {{ t('modals.deleteAccount.title') }}
                    </h5>

                    <BaseButton
                        type="button"
                        variant="link"
                        class="btn-close"
                        :disabled="isProcessing"
                        aria-label="Close"
                        @click="close"
                    />
                </div>

                <div class="modal-body">
                    <p class="mb-0">
                        {{ t('modals.deleteAccount.confirm') }}
                        <br>
                        {{ t('modals.deleteAccount.danger') }}
                    </p>
                </div>

                <div class="modal-footer">

                    <BaseButton
                        type="button"
                        variant="danger"
                        :disabled="isProcessing"
                        @click="confirmDelete"
                    >
                        <span v-if="isProcessing">
                            {{ t('modals.deleteAccount.deleting') }}
                        </span>
                        <span v-else>
                            {{ t('modals.deleteAccount.delete') }}
                        </span>
                    </BaseButton>

                    <BaseButton
                        type="button"
                        variant="secondary"
                        :disabled="isProcessing"
                        @click="close"
                    >
                        {{ t('common.cancel') }}
                    </BaseButton>

                </div>

            </div>
        </div>
    </div>
</template>
