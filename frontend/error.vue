<script setup lang="ts">

import {useI18n} from 'vue-i18n'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

const props = defineProps<{
    error: {
        statusCode?: number
        statusMessage?: string
    }
}>()

const is404 = computed(() => props.error?.statusCode === 404)

</script>

<template>
    <div class="container py-5 text-center">

        <h1 class="display-1 fw-bold text-danger">
            {{ props.error?.statusCode || 500 }}
        </h1>

        <h3 class="mb-3">
            {{ is404 ? t('notFound.title') : t('common.error') }}
        </h3>

        <p class="text-muted mb-4">
            {{
                is404
                    ? t('notFound.description')
                    : props.error?.statusMessage
            }}
        </p>

        <NuxtLink :to="localePath('/')" class="btn btn-primary">
            {{ t('notFound.home') }}
        </NuxtLink>

    </div>
</template>
