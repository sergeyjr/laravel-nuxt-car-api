import {defineNuxtConfig} from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({

    // Совместимость с конкретной версией Nuxt
    compatibilityDate: '2025-07-15',

    // Dev debug-режим
    debug: true,

    // Nuxt DevTools
    devtools: {
        enabled: false
    },

    // SSR (серверный рендеринг)
    ssr: true,

    // Глобальные стили проекта
    css: [
        'bootstrap/dist/css/bootstrap.min.css',
        '@/assets/css/app.css'
    ],

    // Pinia (state management)
    modules: ['@pinia/nuxt'],

    // Конфигурация окружений (SSR + client)
    runtimeConfig: {
        public: {
            apiBase: 'http://laravel/api',
            appName: 'Laravel App',
            backendBase: 'http://laravel',
            debugApi: true
        },
    },

    // Dev server настройки Nuxt
    devServer: {
        host: '0.0.0.0', // доступ извне контейнера
        port: 3000
    },

    // Vite сборка
    vite: {
        build: {
            // отключение минификации в dev (ускоряет сборку/отладку)
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
                host: 'laravel',
                protocol: 'ws',
                clientPort: 80
            },

            // следит за файлами внутри docker volume
            watch: {
                usePolling: true,
            }
        }
    }

})
