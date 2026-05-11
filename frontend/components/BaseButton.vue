<script setup lang="ts">

import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary'
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
    },

    size: {
        type: String,
        default: ''
    }
})

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()

const isDisabled = computed(() => {
    return props.loading || props.disabled
})

const classes = computed(() => [
    'btn',
    `btn-${props.variant}`,
    {
        [`btn-${props.size}`]: props.size
    }
])

const handleClick = (e: MouseEvent) => {

    if (isDisabled.value) {
        return
    }

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

        <span
            v-if="loading"
            class="d-inline-flex align-items-center gap-2"
        >
            <span
                class="spinner-border spinner-border-sm"
                role="status"
            />

            <slot name="loading">
                Загрузка...
            </slot>
        </span>

        <span v-else>
            <slot />
        </span>

    </button>

</template>
