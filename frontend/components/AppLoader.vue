<script setup lang="ts">

import {useUiStore} from "~/stores/ui";

const ui = useUiStore()

</script>

<template>

    <Transition name="loader-fade">

        <div v-if="ui.pageLoading" class="app-loader-overlay">
            <div class="app-loader-box">
                <div class="app-loader-spinner"></div>
                <div class="app-loader-text">
                    {{ ui.loadingText }}
                </div>
            </div>
        </div>

    </Transition>

</template>

<style scoped>

.app-loader-overlay {
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(2px);
    pointer-events: all;
}

.app-loader-box {
    min-width: 240px;
    padding: 32px 28px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.app-loader-spinner {
    width: 52px;
    height: 52px;
    margin: 0 auto 18px;
    border-radius: 50%;
    border: 4px solid #e9ecef;
    border-top-color: #0d6efd;
    animation: loader-spin 0.9s linear infinite;
}

.app-loader-text {
    font-size: 15px;
    font-weight: 600;
    color: #212529;
}

@keyframes loader-spin {
    to {
        transform: rotate(360deg);
    }
}

.loader-fade-enter-active,
.loader-fade-leave-active {
    transition: opacity 0.2s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
    opacity: 0;
}

</style>
