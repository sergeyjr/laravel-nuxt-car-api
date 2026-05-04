<script setup lang="ts">

defineProps<{
    modelValue: string
    label?: string
    error?: string
    required?: boolean
    rows?: number
}>()

const emit = defineEmits(['update:modelValue'])

</script>

<template>
    <div class="mb-3">

        <label v-if="label" class="form-label">
            {{ label }}
            <span v-if="required" class="text-danger">*</span>
        </label>

        <textarea
            class="form-control"
            :class="{ 'is-invalid': error }"
            :value="modelValue"
            :rows="rows || 5"
            :required="required"
            @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        ></textarea>

        <div v-if="error" class="invalid-feedback">
            {{ error }}
        </div>

    </div>
</template>
