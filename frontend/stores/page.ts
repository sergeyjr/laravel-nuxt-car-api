import { defineStore } from 'pinia'

export const usePageStore = defineStore('pages', {
    state: () => ({
        pages: {} as Record<string, any>,
        current: null as any,
        loading: false
    }),

    actions: {
        getApi() {
            return useNuxtApp().$api
        },

        async fetch(code: string) {
            if (!code) return

            const api = this.getApi()

            if (!api) {
                console.error('API не настроен')
                return
            }

            this.loading = true

            try {

                const data = await api(`/page/${code}`)

                this.pages[code] = data
                this.current = data

            } catch (e: any) {

                this.current = null
                throw e

            } finally {
                this.loading = false
            }
        },

        clearCurrent() {
            this.current = null
        }
    }
})
