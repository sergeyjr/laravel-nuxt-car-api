export default defineNuxtPlugin(() => {

    const locale = useState<string>('locale', () => 'ru')

    useHead(() => ({
        htmlAttrs: {
            lang: locale.value
        }
    }))

})
