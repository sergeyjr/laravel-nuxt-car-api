<script setup>

import {computed, watch} from 'vue'
import {useRoute} from '#app'
import {usePageStore} from '~/stores/page'

const route = useRoute()
const store = usePageStore()

const code = computed(() => route.params.code)

watch(
    code,
    async (newCode) => {
        if (!newCode) return
        await store.fetch(String(newCode))
    },
    {immediate: true}
)

const page = computed(() => store.current)
const loading = computed(() => store.loading)

const title = computed(() => {
    if (loading.value) return 'Загрузка страницы...'
    return page.value?.title || 'Страница'
})

const formattedContent = computed(() => {
    return page.value?.content?.replace(/\n/g, '<br>') || ''
})

</script>

<template>
    <div class="container mt-4">

        <div class="row">
            <div class="col-12">

                <h1 class="mb-3">
                    {{ title }}
                </h1>

                <div v-if="loading" class="loading-bar mb-3">
                    Идёт загрузка страницы...
                </div>

                <div v-if="page" :class="{ 'content-loading': loading }">
                    <div
                        class="page-content"
                        v-html="formattedContent"
                    ></div>
                </div>

                <div v-else-if="!loading">
                    <h3>Страница не найдена</h3>
                </div>

            </div>
        </div>

    </div>
</template>

<style scoped>

.loading-bar {
    display: flex;
    align-items: center;
    gap: 8px;

    padding: 10px 14px;
    border-radius: 8px;

    background: rgba(13, 110, 253, 0.08);
    border: 1px solid rgba(13, 110, 253, 0.2);

    color: #0d6efd;
    font-weight: 500;
}

.content-loading {
    opacity: 0.6;
    filter: grayscale(0.2);
    transition: 0.2s ease;
}

.page-content {
    line-height: 1.6;
}

</style>
