<script setup lang="ts">

import {ref, watch, computed} from 'vue'
import {useI18n} from 'vue-i18n'

import BaseButton from '~/components/ui/base/BaseButton.vue'
import BaseInput from '~/components/ui/base/BaseInput.vue'

const {t} = useI18n()

const props = withDefaults(defineProps<{
    show: boolean
    processing?: boolean
    errors?: Record<string, string>
}>(), {
    processing: false
})

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm', payload: { email: string; password: string }): void
}>()

const email = ref('')
const password = ref('')

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
    emit('confirm', {
        email: email.value,
        password: password.value
    })
}

watch(() => props.show, (show) => {
    if (!show) {
        return
    }
    email.value = ''
    password.value = ''
})

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

                    <h5 class="modal-title">
                        {{ t('modals.auth.loginTitle') }}
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

                    <div
                        v-if="errors?.general"
                        class="alert alert-danger"
                    >
                        {{ errors.general }}
                    </div>

                    <form @submit.prevent="confirm">

                        <BaseInput
                            v-model="email"
                            type="email"
                            :label="t('modals.auth.email')"
                            required
                            :disabled="isLocked"
                            :error="errors?.email"
                        />

                        <BaseInput
                            v-model="password"
                            type="password"
                            :label="t('modals.auth.password')"
                            required
                            :disabled="isLocked"
                            :error="errors?.password"
                        />

                        <BaseButton
                            type="submit"
                            class="w-100 mt-3"
                            :loading="isLocked"
                            :disabled="isLocked"
                        >
                            <template #loading>
                                {{ t('modals.auth.loggingIn') }}
                            </template>
                            {{ t('modals.auth.login') }}
                        </BaseButton>

                    </form>

                </div>

            </div>
        </div>
    </div>
</template>
