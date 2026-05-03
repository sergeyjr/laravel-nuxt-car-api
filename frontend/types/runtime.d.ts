declare module 'nuxt/schema' {
    interface RuntimeConfig {
        public: {
            apiBase: string
            appName: string
            backendBase: string
            debugApi?: boolean
        }
    }
}
