<script setup lang="ts">

import {computed} from 'vue'

import {useI18n} from 'vue-i18n'

import {useCartStore} from '~/stores/cart'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

defineProps<{
    show: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'success'): void
}>()

const cart = useCartStore()

const isProcessing = computed(() => {
    return cart.loadingCheckout
})

const close = () => {
    if (isProcessing.value) {
        return
    }
    emit('close')
}

const confirmOrder = () => {
    if (isProcessing.value) {
        return
    }
    emit('success')
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
                    <h5 class="modal-title text-success">
                        {{ t('modals.checkout.title') }}
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
                        {{ t('modals.checkout.confirm') }}
                        <br>
                        {{ t('modals.checkout.warning') }}
                    </p>
                </div>

                <div class="modal-footer">

                    <BaseButton
                        variant="success"
                        :disabled="isProcessing"
                        @click="confirmOrder"
                    >
                        <span v-if="isProcessing">
                            {{ t('modals.checkout.sending') }}
                        </span>
                        <span v-else>
                            {{ t('modals.checkout.confirmButton') }}
                        </span>
                    </BaseButton>

                    <BaseButton
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
