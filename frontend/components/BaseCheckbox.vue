<script setup lang="ts">

const model = defineModel<boolean>({
    default: false,
})

withDefaults(defineProps<{
    id?: string
    label?: string
    disabled?: boolean
}>(), {
    disabled: false,
})

</script>

<template>
    <div class="form-check mb-3">

        <input
            :id="id"
            v-model="model"
            type="checkbox"
            class="form-check-input"
            :disabled="disabled"
        >

        <label
            v-if="label"
            :for="id"
            class="form-check-label"
        >
            {{ label }}
        </label>

    </div>
</template>
