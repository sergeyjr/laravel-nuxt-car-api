<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary' // primary | secondary | success | danger | warning | info | light | dark
    },
    loading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'button'
    }
})

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()

const isDisabled = computed(() => props.loading || props.disabled)

const classes = computed(() => [
    'btn',
    `btn-${props.variant}`,
    { disabled: isDisabled.value }
])

const handleClick = (e: MouseEvent) => {
    if (isDisabled.value) return
    emit('click', e)
}
</script>

<template>
    <button
        v-bind="$attrs"
        :type="type"
        :disabled="isDisabled"
        :class="classes"
        @click="handleClick"
    >
        <!-- LOADING -->
        <span v-if="loading" class="d-inline-flex align-items-center">
            <slot name="loading">Loading...</slot>
        </span>

        <!-- DEFAULT -->
        <span v-else>
            <slot />
        </span>
    </button>
</template>
