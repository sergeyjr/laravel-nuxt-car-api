<script setup>
import { computed, watch, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const store = usePageStore()

const page = computed(() => store.current)
const loading = computed(() => store.loading)

const formattedContent = computed(() => {
    return page.value?.content?.replace(/\n/g, '<br>') || ''
})

const fetchData = async (code) => {
    if (!code) return

    store.clearCurrent()

    try {
        await store.fetch(code)
    } catch (e) {
        const status = e?.response?.status || e?.status

        if (status === 404) {
            await router.push('/not-found')
        } else {
            store.clearCurrent()
        }
    }
}

onMounted(() => {
    fetchData(route.params.code)
})

watch(
    () => route.params.code,
    (newCode) => fetchData(newCode)
)
</script>

<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">

                <div v-if="loading">
                    Загрузка...
                </div>

                <div v-else>
                    <h1 class="mb-3">
                        {{ page?.title || '' }}
                    </h1>

                    <div v-if="page" v-html="formattedContent" />
                </div>

            </div>
        </div>
    </div>
</template>
