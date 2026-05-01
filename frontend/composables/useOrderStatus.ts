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

const isOrderStatus = (status: string): status is OrderStatus => {
    return status in ORDER_STATUS
}

export const useOrderStatus = () => {

    const getLabel = (status: string): string => {
        if (!status) return '—'

        return isOrderStatus(status)
            ? statusLabels[status]
            : status
    }

    const getClass = (status: string): string => {
        if (!status) return 'bg-secondary'

        return isOrderStatus(status)
            ? statusClasses[status]
            : 'bg-secondary'
    }

    return {
        ORDER_STATUS,
        getLabel,
        getClass
    }
}
