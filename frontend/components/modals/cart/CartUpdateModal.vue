<script setup lang="ts">

import {computed} from 'vue'
import {useI18n} from 'vue-i18n'

import BaseButton from '~/components/ui/base/BaseButton.vue'

const {t} = useI18n()

const props = defineProps<{
    show: boolean
    processing?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm'): void
}>()

const isLocked = computed(() => Boolean(props.processing))

const close = () => {
    if (isLocked.value) return
    emit('close')
}

const confirm = () => {
    if (isLocked.value) return
    emit('confirm')
}

</script>

<template>
    <div
        v-if="show"
        class="modal fade show d-block"
        style="background: rgba(0,0,0,.6);"
        @click.self="close"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ t('modals.cartUpdate.title') }}
                    </h5>

                    <BaseButton
                        variant="link"
                        class="btn-close"
                        :disabled="isLocked"
                        @click="close"
                    />
                </div>

                <div class="modal-body">
                    {{ t('modals.cartUpdate.text') }}
                </div>

                <div class="modal-footer">
                    <BaseButton
                        variant="secondary"
                        :disabled="isLocked"
                        @click="close"
                    >
                        {{ t('common.cancel') }}
                    </BaseButton>

                    <BaseButton
                        variant="primary"
                        :disabled="isLocked"
                        @click="confirm"
                    >
                        {{ isLocked ? t('modals.cartUpdate.confirming') : t('modals.cartUpdate.confirm') }}
                    </BaseButton>
                </div>

            </div>
        </div>
    </div>
</template>
