<script setup lang="ts">

import {computed} from 'vue'

import {useI18n} from 'vue-i18n'

import BaseButton from '~/components/ui/base/BaseButton.vue'

type Meta = {
    current_page: number
    last_page: number
}

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

/* -----------------------------
   props / emits
------------------------------*/

const props = defineProps<{
    meta: Meta | null
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'change', page: number): void
}>()

/* -----------------------------
   computed
------------------------------*/

const pages = computed(() => {
    if (!props.meta) return []
    return Array.from({length: props.meta.last_page}, (_, i) => i + 1)
})

const isFirstPage = computed(() => {
    return !props.meta || props.meta.current_page <= 1
})

const isLastPage = computed(() => {
    return !props.meta || props.meta.current_page >= props.meta.last_page
})

function change(page: number) {
    emit('change', page)
}

</script>

<template>
    <div v-if="meta" class="d-flex gap-2 align-items-center flex-wrap">

        <BaseButton
            :disabled="isFirstPage || loading"
            :variant="isFirstPage ? 'outline-primary' : 'primary'"
            @click="change(meta!.current_page - 1)"
        >
            {{ t('pagination.prev') }}
        </BaseButton>

        <BaseButton
            v-for="p in pages"
            :key="p"
            :variant="p === meta!.current_page ? 'primary' : 'outline-primary'"
            :disabled="loading"
            @click="change(p)"
        >
            {{ p }}
        </BaseButton>

        <BaseButton
            :disabled="isLastPage || loading"
            :variant="isLastPage ? 'outline-primary' : 'primary'"
            @click="change(meta!.current_page + 1)"
        >
            {{ t('pagination.next') }}
        </BaseButton>

    </div>
</template>
