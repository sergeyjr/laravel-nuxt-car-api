import { defineStore } from 'pinia'

export const useOrderStatusStore = defineStore('orderStatus', () => {
    const ORDER_STATUS = {
        pending_payment: 'pending_payment',
        processing: 'processing',
        packed: 'packed',
        shipped: 'shipped',
        completed: 'completed',
        cancelled: 'cancelled',
        refunded: 'refunded'
    } as const

    const labels: Record<string, string> = {
        pending_payment: 'Ожидает оплаты',
        processing: 'В обработке',
        packed: 'Собран',
        shipped: 'Отправлен',
        completed: 'Завершён',
        cancelled: 'Отменён',
        refunded: 'Возврат'
    }

    const classes: Record<string, string> = {
        pending_payment: 'pending_payment',
        processing: 'processing',
        packed: 'packed',
        shipped: 'shipped',
        completed: 'completed',
        cancelled: 'cancelled',
        refunded: 'refunded'
    }

    function getLabel(status: string) {
        return labels[status] ?? status
    }

    function getClass(status: string) {
        return classes[status] ?? ''
    }

    return {
        ORDER_STATUS,
        getLabel,
        getClass
    }
})
