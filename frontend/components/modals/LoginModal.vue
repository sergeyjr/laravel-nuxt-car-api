<script setup lang="ts">

import {ref, watch, computed} from 'vue'

import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

const props = defineProps<{
    show: boolean
    loading?: boolean
    errors?: Record<string, string>
}>()

const emit = defineEmits<{
    (e: 'update:show', value: boolean): void
    (e: 'confirm', payload: { email: string; password: string }): void
}>()

const email = ref('')
const password = ref('')

const isProcessing = computed(() => {
    return props.loading ?? false
})

const close = () => {
    if (isProcessing.value) {
        return
    }
    emit('update:show', false)
}

const submit = () => {

    emit('confirm', {
        email: email.value,
        password: password.value,
    })
}

watch(() => props.show, (val) => {
    if (val) {
        email.value = ''
        password.value = ''
    }
})

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
                        Вход
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

                    <div
                        v-if="errors?.general"
                        class="alert alert-danger"
                    >
                        {{ errors.general }}
                    </div>

                    <form @submit.prevent="submit">

                        <BaseInput
                            v-model="email"
                            type="email"
                            label="Email"
                            required
                            :disabled="isProcessing"
                            :error="errors?.email"
                        />

                        <BaseInput
                            v-model="password"
                            type="password"
                            label="Пароль"
                            required
                            :disabled="isProcessing"
                            :error="errors?.password"
                        />

                        <BaseButton
                            type="submit"
                            class="w-100 mt-3"
                            :loading="isProcessing"
                        >
                            <template #loading>
                                Входим...
                            </template>
                            Войти
                        </BaseButton>

                    </form>
                </div>

            </div>
        </div>
    </div>
</template>
