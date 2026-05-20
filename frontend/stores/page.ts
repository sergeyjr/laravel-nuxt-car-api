import {defineStore} from 'pinia'
import {usePageApi} from '~/services/api/page.api'
import type {PageResponse} from '~/types/page'

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

            if (!code) {
                return null
            }

            this.error = null
            this.activeCode = code

            const cached = this.pages[code]
            if (cached) {
                this.loading = false
                return cached
            }

            this.loading = true
            const pageApi = usePageApi()

            try {
                const data = await pageApi.fetchPage(code)
                if (this.activeCode !== code) {
                    return null
                }
                this.pages[code] = data
                return data
            } catch (e: any) {
                if (this.activeCode === code) {
                    this.error = e
                }
                console.error(e)
                return null
            } finally {
                if (this.activeCode === code) {
                    this.loading = false
                }
            }

        }

    }

})
