<script setup lang="ts">

const props = withDefaults(defineProps<{
    label?: string
    error?: string
    disabled?: boolean
}>(), {
    disabled: false,
})

const emit = defineEmits<{
    (e: 'change', event: Event): void
}>()

</script>

<template>
    <div class="mb-3">

        <label
            v-if="label"
            class="form-label"
        >
            {{ label }}
        </label>

        <input
            type="file"
            class="form-control"
            :class="{ 'is-invalid': error }"
            :disabled="disabled"
            @change="emit('change', $event)"
        >

        <small
            v-if="error"
            class="text-danger"
        >
            {{ error }}
        </small>

    </div>
</template>
