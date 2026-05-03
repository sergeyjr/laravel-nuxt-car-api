import {defineStore} from 'pinia'
import {usePageApi, type PageResponse} from '~/services/api/internal/page.api'

export const usePageStore = defineStore('pages', {

    state: () => ({
        pages: {} as Record<string, PageResponse>,
        loading: false,
        error: null as any,
        activeCode: null as string | null
    }),

    getters: {
        current: (state) => {
            if (!state.activeCode) return null
            return state.pages[state.activeCode] || null
        }
    },

    actions: {

        async fetch(code: string) {
            if (!code) return

            this.loading = true
            this.error = null
            this.activeCode = code

            const pageApi = usePageApi()

            try {
                const data = await pageApi.fetchPage(code)

                // кешируем по коду
                this.pages[code] = data

                return data

            } catch (e: any) {
                this.error = e
                console.error('[page store] fetch error:', e)

                return null

            } finally {
                this.loading = false
            }
        },

        clearCurrent() {
            this.activeCode = null
        },

        clearCache() {
            this.pages = {}
            this.activeCode = null
        }

    }

})
