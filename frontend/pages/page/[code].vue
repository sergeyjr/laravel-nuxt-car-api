<script setup>

import {computed, watch} from 'vue'
import {useRoute, navigateTo, createError} from '#app'
import {usePageStore} from '~/stores/page'

const route = useRoute()

const store = usePageStore()

const code = computed(() => route.params.code)

// реагируем на смену route
watch(
    code,
    async (newCode) => {
        if (!newCode) return
        await store.fetch(newCode)
    },
    { immediate: true }
)

const page = computed(() => store.current)
const loading = computed(() => store.loading)

const formattedContent = computed(() => {
    return page.value?.content?.replace(/\n/g, '<br>') || ''
})

</script>

<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">

                <div v-if="loading">
                    Загрузка...
                </div>

                <div v-else-if="page">
                    <h1 class="mb-3">
                        {{ page.title }}
                    </h1>

                    <div v-html="formattedContent"></div>
                </div>

                <div v-else>
                    <h3>Страница не найдена</h3>
                </div>

            </div>
        </div>
    </div>
</template>
