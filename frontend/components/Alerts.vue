<script setup lang="ts">

import {storeToRefs} from 'pinia'

import {useAlertStore} from '~/stores/alert'

const alertStore = useAlertStore()

const {alerts} = storeToRefs(alertStore)

const alertClass = (type: string) => {
    return {
        success: 'alert-success',
        error: 'alert-danger',
        info: 'alert-info',
        warning: 'alert-warning',
        status: 'alert-primary'
    }[type] || 'alert-secondary'
}

</script>

<template>
    <div v-if="alerts.length" class="container mt-4">
        <div class="row">
            <div class="col-12">

                <div
                    v-for="alert in alerts"
                    :key="alert.id"
                    :class="['alert', alertClass(alert.type)]"
                >

                    {{ alert.message }}

                    <BaseButton
                        variant="link"
                        class="btn-close"
                        aria-label="Close alert"
                        @click="alertStore.remove(alert.id)"
                    />

                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>

.alert {
    position: relative;
    border-radius: 8px;
    padding: 12px 15px;
    font-size: 14px;
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

</style>
