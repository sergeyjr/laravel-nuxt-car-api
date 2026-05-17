<script setup lang="ts">

import {computed} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const localePath = useLocalePath()

/* -----------------------------
   props
------------------------------*/

const props = withDefaults(defineProps<{
    show: boolean
    loading?: boolean
}>(), {
    loading: false
})

const emit = defineEmits<{
    (e: 'update:show', value: boolean): void
    (e: 'confirm'): void
}>()

/* -----------------------------
   computed
------------------------------*/

const isProcessing = computed(() => props.loading)

/* -----------------------------
   actions
------------------------------*/

const close = () => {
    if (isProcessing.value) return
    emit('update:show', false)
}

const confirmLogout = () => {
    if (isProcessing.value) return
    emit('confirm')
}

</script>

<template>
    <div
        v-if="show"
        class="modal fade show d-block"
        tabindex="-1"
        style="background: rgba(0,0,0,.5);"
        @click.self="close"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ t('modals.logout.title') }}
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
                        {{ t('modals.logout.text') }}
                    </p>
                </div>

                <div class="modal-footer">

                    <BaseButton
                        variant="danger"
                        :disabled="isProcessing"
                        @click="confirmLogout"
                    >
                        <span v-if="isProcessing">
                            {{ t('modals.logout.loggingOut') }}
                        </span>
                        <span v-else>
                            {{ t('modals.logout.confirm') }}
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
