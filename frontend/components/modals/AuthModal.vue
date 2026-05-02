<script setup lang="ts">

import {ref, watch} from 'vue'
import {useAuthStore} from '~/stores/auth'
import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const store = useAuthStore()

const email = ref('')
const password = ref('')

const close = () => {
    emit('update:modelValue', false)
}

const submit = async () => {
    store.errors = {}

    let hasError = false

    if (!email.value) {
        store.errors.email = 'Email обязателен'
        hasError = true
    }

    if (!password.value) {
        store.errors.password = 'Пароль обязателен'
        hasError = true
    }

    if (hasError) return

    const ok = await store.login(email.value, password.value)

    if (ok) {
        close()
    }
}

watch(() => props.modelValue, (val) => {
    if (val) {
        store.clearErrors()
    }
})

</script>

<template>
    <div v-if="modelValue" class="modal-overlay" @click.self="close">

        <div class="modal-box">

            <!-- CLOSE BUTTON -->
            <button class="modal-close" @click="close" aria-label="Close modal">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                </svg>
            </button>

            <h3 class="mb-3">Вход</h3>

            <form @submit.prevent="submit">

                <BaseInput
                    v-model="email"
                    type="email"
                    label="Email"
                    required
                    :error="store.errors.email"
                />

                <BaseInput
                    v-model="password"
                    type="password"
                    label="Пароль"
                    required
                    :error="store.errors.password"
                />

                <BaseButton
                    type="submit"
                    class="w-100 mt-3"
                    :loading="store.loading"
                >
                    <template #loading>
                        Входим...
                    </template>
                    Войти
                </BaseButton>

            </form>

        </div>

    </div>
</template>

<style scoped>

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-box {
    position: relative;
    width: 100%;
    max-width: 420px;
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, .3);
}

/* CLOSE BUTTON */
.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.15s ease;
}

.modal-close:hover {
    background: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.85);
}

.modal-close:active {
    transform: scale(0.95);
}

.modal-close svg {
    pointer-events: none;
}

</style>
