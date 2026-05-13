<script setup lang="ts">

import {computed, watch} from 'vue'

import {usePageStore} from '~/stores/page'

const route = useRoute()
const store = usePageStore()

const code = computed(() => String(route.params.code || ''))

watch(
    code,
    async (newCode) => {
        if (!newCode) return
        await store.fetch(newCode)
    },
    {immediate: true}
)

const page = computed(() => store.current)

</script>

<template>
    <div class="container mt-4">

        <h1 class="mb-4">{{ page?.title || '' }}</h1>

        <template v-if="store.loading">
            <div class="alert alert-light mb-4">
                Идёт загрузка страницы...
            </div>
        </template>

        <template v-if="page">
            <div :class="{ 'content-loading': store.loading }">
                <div class="page-content" v-html="page.content" />
            </div>
        </template>

        <template v-else-if="!store.loading">
            <h3>Страница не найдена</h3>
        </template>

    </div>
</template>
