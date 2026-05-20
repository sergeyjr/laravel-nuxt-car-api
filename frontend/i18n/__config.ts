export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'ru',
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false,
    warnHtmlMessage: false,
    datetimeFormats: {
        ru: {
            short: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }
        },
        en: {
            short: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }
        }
    },
    numberFormats: {
        ru: {
            currency: {
                style: 'currency',
                currency: 'RUB'
            }
        },
        en: {
            currency: {
                style: 'currency',
                currency: 'USD'
            }
        }
    }
}))
