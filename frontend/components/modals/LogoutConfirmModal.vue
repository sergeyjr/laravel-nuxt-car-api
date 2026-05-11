<script setup lang="ts">

import {computed} from 'vue'
import {useAuthStore} from '~/stores/auth'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])

const authStore = useAuthStore()
const isProcessing = computed(() => authStore.loggingOut)

const close = () => {
    if (!isProcessing.value) emit('close')
}

const confirmLogout = async () => {
    await authStore.logout()
    close()
}

</script>

<template>
    <div
        class="modal fade show d-block"
        tabindex="-1"
        v-if="show"
        style="background: rgba(0,0,0,.5);"
        @click.self="close"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Выход из аккаунта</h5>
                    <button type="button" class="btn-close" @click="close"></button>
                </div>

                <div class="modal-body">
                    <p class="mb-0">Вы уверены, что хотите выйти?</p>
                </div>

                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        :disabled="isProcessing"
                        @click="close"
                    >
                        Отмена
                    </button>

                    <button
                        class="btn btn-danger"
                        :disabled="isProcessing"
                        @click="confirmLogout"
                    >
                        Выйти
                    </button>

                </div>

            </div>
        </div>
    </div>
</template>
