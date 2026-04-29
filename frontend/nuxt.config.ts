import {defineNuxtConfig} from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({

    compatibilityDate: '2025-07-15',

    debug: false,

    nitro: {
        logLevel: 'error'
    },

    // Vue DevTools
    devtools: {enabled: false},

    ssr: true,

    css: [
        'bootstrap/dist/css/bootstrap.min.css',
        '@/assets/css/app.css'
    ],

    modules: ['@pinia/nuxt'],

    runtimeConfig: {
        public: {
            apiBase: '/api'
        }
    },

    devServer: {
        host: '0.0.0.0',
        port: 3000
    },

    vite: {
        build: {
            minify: false
        },
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
                'axios',
                'bootstrap',
                'swiper/modules',
                'swiper/vue',
            ]
        },
        plugins: [
            tsconfigPaths()
        ],
        server: {
            hmr: {
                host: 'laravel',
                protocol: 'ws',
                clientPort: 80
            },
            watch: {
                usePolling: true,
            }
        }
    }

})
