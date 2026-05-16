<script setup lang="ts">

import {useRoute} from 'vue-router'

const route = useRoute()

const isActive = (path: string) => {
    if (path === '/') {
        return route.path === '/'
    }

    return route.path === path || route.path.startsWith(path + '/')
}

const config = useRuntimeConfig()

const appName = config.public.appName

const year = new Date().getFullYear()

const {t} = useI18n()

const publicLinks = computed(() => [
    {to: '/cars', label: t('nav.catalog')},
    {to: '/contact', label: t('nav.contacts')},
    {to: '/page/about', label: t('nav.about')},
    {to: '/page/info', label: t('nav.info')}
])

</script>

<template>
    <footer class="app-footer mt-5 py-4 border-top">
        <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">

            <div class="text-muted small">
                © {{ year }} {{ appName }}. Все права защищены.
            </div>

            <div class="d-flex gap-3 mt-2 mt-md-0">

                <NuxtLink
                    v-for="link in publicLinks"
                    :key="link.to"
                    :to="link.to"
                    class="footer-link"
                    :class="{ active: isActive(link.to) }"
                >
                    {{ link.label }}
                </NuxtLink>

            </div>

        </div>
    </footer>
</template>

<style scoped>

.app-footer {
    background: transparent;
}

.footer-link {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    text-decoration: none;
    transition: color 0.15s ease;
}

.footer-link:hover {
    color: rgba(0, 0, 0, 0.9);
}

</style>
