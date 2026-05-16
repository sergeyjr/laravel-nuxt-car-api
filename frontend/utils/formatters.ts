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

// Phone

export const formatPhoneRU = (phone?: string | number | null) => {
    if (!phone) return ''

    let digits = String(phone).replace(/\D/g, '')

    if (digits.startsWith('8')) {
        digits = '7' + digits.slice(1)
    }

    if (digits.length === 10) {
        digits = '7' + digits
    }

    if (digits.length !== 11) return phone.toString()

    const country = '+7'
    const area = digits.slice(1, 4)
    const first = digits.slice(4, 7)
    const second = digits.slice(7, 9)
    const third = digits.slice(9, 11)

    return `${country} (${area}) ${first}-${second}-${third}`
}
