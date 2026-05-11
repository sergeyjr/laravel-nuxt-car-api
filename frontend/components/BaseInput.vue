<script setup lang="ts">
import {computed} from 'vue'

interface Props {
    modelValue: string | number
    type?: string
    label?: string
    required?: boolean
    placeholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    id?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    type: 'text',
    label: '',
    required: false,
    placeholder: '',
    hint: '',
    error: '',
    disabled: false,
    id: ''
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>()

const value = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const inputId = computed(() =>
    props.id || `input-${Math.random().toString(36).slice(2, 10)}`
)
</script>

<template>
    <div class="mb-3">

        <label
            v-if="label"
            class="form-label"
            :for="inputId"
        >
            {{ label }}
            <span v-if="required" class="text-danger ms-1">*</span>
        </label>

        <input
            v-bind="$attrs"
            :id="inputId"
            :type="type"
            v-model="value"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            class="form-control"
            :class="{ 'is-invalid': error }"
        />

        <div v-if="error" class="invalid-feedback">
            {{ error }}
        </div>

    </div>
</template>
