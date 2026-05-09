import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {

    state: () => ({
        pageLoading: false,
        loadingText: 'Загрузка...'
    }),

    actions: {

        showLoader(text = 'Загрузка...') {
            this.loadingText = text
            this.pageLoading = true
        },

        hideLoader() {
            this.pageLoading = false
        }

    }

})
