<script setup lang="ts">

defineProps<{
    modelValue: string
    label?: string
    error?: string
    required?: boolean
    rows?: number
    disabled?: boolean
}>()

const emit = defineEmits([
    'update:modelValue'
])

</script>

<template>

    <div class="mb-3">

        <label
            v-if="label"
            class="form-label"
        >
            {{ label }}

            <span
                v-if="required"
                class="text-danger"
            >
                *
            </span>
        </label>

        <textarea
            v-bind="$attrs"
            class="form-control"
            :class="{ 'is-invalid': error }"
            :value="modelValue"
            :rows="rows || 5"
            :required="required"
            :disabled="disabled"
            @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        />

        <div
            v-if="error"
            class="invalid-feedback"
        >
            {{ error }}
        </div>

    </div>

</template>
