<script setup lang="ts">

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
            {{ is404 ? 'Страница не найдена' : 'Ошибка' }}
        </h3>

        <p class="text-muted mb-4">
            {{
                is404
                    ? 'Возможно, ссылка устарела или страница была удалена.'
                    : props.error?.statusMessage
            }}
        </p>

        <NuxtLink to="/" class="btn btn-primary">
            На главную
        </NuxtLink>

    </div>
</template>
