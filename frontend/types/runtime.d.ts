declare module 'nuxt/schema' {
    interface RuntimeConfig {
        public: {
            apiBase: string
            backendBase: string
            debugApi?: boolean
        }
    }
}
