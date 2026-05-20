<script setup lang="ts">

import {computed} from 'vue'
import {useI18n} from 'vue-i18n'

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
    if (isLocked.value) {
        return
    }
    emit('close')
}

const confirm = () => {
    if (isLocked.value) {
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
                        {{ t('modals.cartClear.title') }}
                    </h5>

                    <BaseButton
                        variant="link"
                        class="btn-close"
                        :disabled="isLocked"
                        aria-label="Close"
                        @click="close"
                    />

                </div>

                <div class="modal-body">

                    <p class="mb-0">
                        {{ t('modals.cartClear.textLine1') }}
                        <br>
                        {{ t('modals.cartClear.textLine2') }}
                    </p>

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
                        variant="danger"
                        :disabled="isLocked"
                        @click="confirm"
                    >
                        {{
                            isLocked
                                ? t('modals.cartClear.clearing')
                                : t('modals.cartClear.confirm')
                        }}
                    </BaseButton>

                </div>

            </div>
        </div>
    </div>
</template>
