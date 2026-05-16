// Price

const priceFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
})

export const formatPrice = (price?: number | null) =>
    `${priceFormatter.format(price ?? 0)}`

// Date

export const formatDate = (date: string | number | Date | null | undefined) => {
    if (!date) return ''

    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: 'Europe/Moscow'
    }).format(new Date(date))
}

// formatPhone()

// formatNumber()
