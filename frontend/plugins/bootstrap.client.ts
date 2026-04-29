import * as bootstrap from 'bootstrap'

export default defineNuxtPlugin(() => {
    console.log('SPA App loaded')

    return {
        provide: {
            bootstrap
        }
    }
})
