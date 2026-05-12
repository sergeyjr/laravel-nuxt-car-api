<script setup lang="ts">

import {computed} from 'vue'
import {useProfileStore} from '~/stores/profile'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])

const profile = useProfileStore()

const isProcessing = computed(() => profile.loadingDelete)

const close = () => {
    if (!isProcessing.value) {
        emit('close')
    }
}

const confirmDelete = async () => {
    await profile.deleteAccount()
    close()
}

</script>

<template>
    <div
        class="modal fade show d-block"
        tabindex="-1"
        v-if="show"
        style="background: rgba(0,0,0,.6);"
        @click.self="close"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title text-danger">
                        Удаление аккаунта
                    </h5>

                    <button
                        type="button"
                        class="btn-close"
                        @click="close"
                        :disabled="isProcessing"
                    ></button>
                </div>

                <div class="modal-body">
                    <p class="mb-0">
                        Вы уверены, что хотите удалить аккаунт?<br>
                        Это действие <strong>нельзя отменить</strong>.
                    </p>
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
                        :disabled="isProcessing"
                        @click="confirmDelete"
                    >
                        <span v-if="isProcessing">
                            Удаляем...
                        </span>
                        <span v-else>
                            Удалить
                        </span>
                    </BaseButton>

                </div>

            </div>
        </div>
    </div>
</template>
