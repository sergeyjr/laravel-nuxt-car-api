import {defineNuxtConfig} from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({

    // Совместимость с конкретной версией Nuxt
    compatibilityDate: '2026-05-04',

    // Dev debug-режим
    debug: false,

    // Nuxt DevTools
    devtools: {
        enabled: false
    },

    // SSR (серверный рендеринг HTML)
    ssr: true,

    // Глобальные стили проекта
    css: [
        'bootstrap/dist/css/bootstrap.min.css',
        'bootstrap-icons/font/bootstrap-icons.css',
        'flag-icons/css/flag-icons.min.css',
        'github-markdown-css/github-markdown.css',
        '@/assets/css/app.css',
    ],

    // Pinia (state management)
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/i18n'
    ],

    i18n: {
        defaultLocale: 'ru',
        strategy: 'prefix_except_default',
        langDir: 'locales',
        locales: [
            {code: 'ru', file: 'ru.ts', name: 'Русский'},
            {code: 'en', file: 'en.ts', name: 'English'}
        ],
        detectBrowserLanguage: false,
        //vueI18n: './i18n/config',
    },

    // Конфигурация окружений
    runtimeConfig: {
        apiBase: 'http://laravel.local', // SSR (server)
        public: {
            apiBase: 'http://laravel.local', // Браузер (client)
            appName: 'Laravel App',
            debugApi: true,
        },
    },

    // Dev server настройки Nuxt
    devServer: {
        host: '0.0.0.0', // доступ извне контейнера
        port: 3000,
    },

    experimental: {
        // восстановление состояния между навигациями
        // restoreState: false,

        // очищает кеш useAsyncData / useFetch при переходах между страницами
        purgeCachedData: false,
    },

    // Vite сборка
    vite: {

        cacheDir: '.nuxt/vite-cache-dev',

        build: {
            // минификация в dev (включение ускоряет сборку/отладку)
            minify: false
        },

        // зависимости, которые заранее бандлятся для ускорения
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
                'bootstrap',
                'swiper/modules',
                'swiper/vue',
            ]
        },

        // Vite плагины
        plugins: [
            tsconfigPaths()
        ],

        // Dev server (HMR + watch)
        server: {

            hmr: {
                // домен, через который идёт websocket hot reload
                //host: 'laravel.local',
                protocol: 'ws',
                clientPort: 80
            },

            allowedHosts: ['laravel.local'],

            // следит за файлами внутри docker volume
            watch: {
                interval: 100,
                usePolling: true,
            }
        }

    }

})
