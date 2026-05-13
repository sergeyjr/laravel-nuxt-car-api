<?php

namespace App\Enums;

enum OrderStatus: string
{

    /**
     * Ожидает оплаты
     */
    case PendingPayment = 'pending_payment';

    /**
     * В обработке
     */
    case Processing = 'processing';

    /**
     * Заказ собран
     */
    case Packed = 'packed';

    /**
     * Заказ отправлен
     */
    case Shipped = 'shipped';

    /**
     * Заказ завершён
     */
    case Completed = 'completed';

    /**
     * Заказ отменён
     */
    case Cancelled = 'cancelled';

    /**
     * Возврат средств
     */
    case Refunded = 'refunded';

}
