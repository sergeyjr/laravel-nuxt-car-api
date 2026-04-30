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

            // cache
            if (this.pages[code]) {
                this.current = this.pages[code]
                return
            }

            this.loading = true

            try {

                const data = await api(`/page/${code}`)

                console.log('REAL RESPONSE:', data)

                this.pages[code] = data
                this.current = data

            } catch (e: any) {

                console.log('--- API ERROR START ---')
                console.log('Message:', e?.message)
                // у $fetch нет config как в axios
                console.log('URL:', `/page/${code}`)
                console.log('Status:', e?.statusCode || e?.response?.status)
                console.log('Response data:', e?.data || e?.response?._data)
                console.log('--- API ERROR END ---')

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
