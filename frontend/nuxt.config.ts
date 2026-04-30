import {defineNuxtConfig} from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({

    // Совместимость с конкретной версией Nuxt
    compatibilityDate: '2025-07-15',

    // Отключает dev debug-режим
    debug: false,

    // Nuxt DevTools (выключены)
    devtools: {
        enabled: false
    },

    // SSR включён (серверный рендеринг)
    ssr: true,

    // Глобальные стили проекта
    css: [
        'bootstrap/dist/css/bootstrap.min.css',
        '@/assets/css/app.css'
    ],

    // Подключён Pinia (state management)
    modules: ['@pinia/nuxt'],

    // Конфигурация окружений (важно для SSR + client)
    runtimeConfig: {
        public: {
            apiBase: 'http://laravel/api'
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
                //'axios',
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
