<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close'])

const authStore = useAuthStore()

const isProcessing = computed(() => authStore.loggingOut)

const close = () => {
    emit('close')
}

const confirmLogout = async () => {
    await authStore.logout()
    close()
}
</script>

<template>
    <div v-if="show" class="modal-mask" @click.self="close">

        <div class="modal-wrapper">
            <div class="modal-container">

                <div class="modal-header">
                    <h3>Подтверждение выхода</h3>
                    <span class="close-modal" @click="close">×</span>
                </div>

                <div class="modal-body">
                    <p>Вы уверены, что хотите выйти из аккаунта?</p>
                </div>

                <div class="modal-footer">

                    <BaseButton
                        variant="secondary"
                        :disabled="isProcessing"
                        @click="close"
                    >
                        Отмена
                    </BaseButton>

                    <BaseButton
                        variant="danger"
                        :loading="isProcessing"
                        :disabled="isProcessing"
                        @click="confirmLogout"
                    >
                        Выход
                    </BaseButton>

                </div>

            </div>
        </div>

    </div>
</template>

<style scoped>
.modal-mask {
    position: fixed;
    inset: 0;
    z-index: 9998;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-container {
    background: #fff;
    border-radius: 6px;
    width: 400px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.modal-header,
.modal-body,
.modal-footer {
    padding: 1rem;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid #eee;
}

.close-modal {
    cursor: pointer;
}
</style>
