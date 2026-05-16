<script setup lang="ts">

import {computed, watch} from 'vue'

import {useRoute} from 'vue-router'

import {usePageStore} from '~/stores/page'

/* -----------------------------
   store
------------------------------*/

const pageStore = usePageStore()

const route = useRoute()

/* -----------------------------
   route param
------------------------------*/

const code = computed(() => String(route.params.code || ''))

/* -----------------------------
   load page
------------------------------*/

watch(
    code,
    async (newCode) => {
        if (!newCode) return
        await pageStore.fetch(newCode)
    },
    {immediate: true}
)

/* -----------------------------
   state
------------------------------*/

const page = computed(() => pageStore.current)

</script>

<template>
    <div class="container mt-4">

        <h1 class="mb-4">{{ page?.title || '' }}</h1>

        <template v-if="pageStore.loading">
            <div class="alert alert-light mb-4">
                Загрузка страницы...
            </div>
        </template>

        <template v-if="page">
            <div :class="{ 'content-loading': pageStore.loading }">
                <div class="page-content" v-html="page.content"/>
            </div>
        </template>

        <template v-else-if="!pageStore.loading">
            <div class="alert alert-light mb-4">
                Страница не найдена.
            </div>
        </template>

    </div>
</template>
