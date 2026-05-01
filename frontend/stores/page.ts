import {defineStore} from 'pinia'
import {pageApi, type PageResponse} from '~/services/api/page.api'

export const usePageStore = defineStore('pages', {
    state: () => ({
        pages: {} as Record<string, PageResponse>,
        current: null as PageResponse | null,
        loading: false,
        error: null as any
    }),

    actions: {

        async fetch(code: string) {
            if (!code) return

            this.loading = true
            this.error = null

            try {
                const data = await pageApi.fetchPage(code)

                this.pages[code] = data
                this.current = data

            } catch (e: any) {
                this.current = null
                this.error = e
                console.error('Page fetch error:', e)

            } finally {
                this.loading = false
            }
        },

        clearCurrent() {
            this.current = null
        }
    }
})
