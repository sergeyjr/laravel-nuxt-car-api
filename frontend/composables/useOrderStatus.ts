export const ORDER_STATUS = {
    pending_payment: 'pending_payment',
    processing: 'processing',
    packed: 'packed',
    shipped: 'shipped',
    completed: 'completed',
    cancelled: 'cancelled',
    refunded: 'refunded'
} as const

export type OrderStatus =
    typeof ORDER_STATUS[keyof typeof ORDER_STATUS]

const statusLabels: Record<OrderStatus, string> = {
    pending_payment: 'Ожидает оплаты',
    processing: 'В обработке',
    packed: 'Собран',
    shipped: 'Отправлен',
    completed: 'Завершён',
    cancelled: 'Отменён',
    refunded: 'Возврат'
}

const statusClasses: Record<OrderStatus, string> = {
    pending_payment: 'pending_payment',
    processing: 'processing',
    packed: 'packed',
    shipped: 'shipped',
    completed: 'completed',
    cancelled: 'cancelled',
    refunded: 'refunded'
}

export const useOrderStatus = () => {
    const getLabel = (status: string) => {
        return statusLabels[status as OrderStatus] || status
    }

    const getClass = (status: string) => {
        return statusClasses[status as OrderStatus] || ''
    }

    return {
        ORDER_STATUS,
        getLabel,
        getClass
    }
}
