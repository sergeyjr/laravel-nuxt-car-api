<script setup lang="ts">

import {computed, watch} from 'vue'
import {usePageStore} from '~/stores/page'

const route = useRoute()
const store = usePageStore()

const code = computed(() => route.params.code)

watch(
    code,
    async (newCode) => {
        if (!newCode) {
            return
        }
        await store.fetch(String(newCode))
    },
    {
        immediate: true
    }
)

const page = computed(() => store.current)
const loading = computed(() => store.loading)

const title = computed(() => {
    return page.value?.title || ''
})

const content = computed(() => {
    return page.value?.content || ''
})

</script>

<template>

    <div class="container mt-4">

        <div class="row">

            <div class="col-12">

                <h1 class="mb-4">
                    {{ title }}
                </h1>

                <div
                    v-if="loading"
                    class="alert alert-light mb-4"
                >
                    Идёт загрузка страницы...
                </div>

                <div
                    v-if="page"
                    :class="{ 'content-loading': loading }"
                >

                    <div
                        class="page-content"
                        v-html="content"
                    />

                </div>

                <div v-else-if="!loading">

                    <h3>
                        Страница не найдена
                    </h3>

                </div>

            </div>

        </div>

    </div>

</template>

<style scoped>

.content-loading {
    opacity: 0.6;
    filter: grayscale(0.2);
    transition: 0.2s ease;
}

.page-content {
    line-height: 1.7;
}

.page-content :deep(p) {
    margin-bottom: 1rem;
}

.page-content :deep(table) {
    width: 100%;
    margin-bottom: 1rem;
}

.page-content :deep(pre) {
    border-radius: 8px;
    overflow-x: auto;
}

</style>
