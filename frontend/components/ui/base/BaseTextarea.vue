<script setup lang="ts">

import {computed, useId} from 'vue'

interface Props {
    modelValue: string
    label?: string
    error?: string
    required?: boolean
    rows?: number
    disabled?: boolean
    id?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    error: '',
    required: false,
    rows: 5,
    disabled: false,
    id: ''
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const value = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const generatedId = useId()

const textareaId = computed(() => {
    return props.id || generatedId
})

</script>

<template>

    <div class="mb-3">

        <label
            v-if="label"
            class="form-label"
            :for="textareaId"
        >
            {{ label }}

            <span
                v-if="required"
                class="text-danger ms-1"
            >
                *
            </span>
        </label>

        <textarea
            v-bind="$attrs"
            :id="textareaId"
            v-model="value"
            class="form-control"
            :class="{ 'is-invalid': error }"
            :rows="rows"
            :required="required"
            :disabled="disabled"
        />

        <div
            v-if="error"
            class="invalid-feedback"
        >
            {{ error }}
        </div>

    </div>

</template>
