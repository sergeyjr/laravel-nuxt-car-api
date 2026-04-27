<?php

namespace App\Enums;

enum OrderStatus: string
{

    case PendingPayment = 'pending_payment';
    case Processing = 'processing';
    case Packed = 'packed';
    case Shipped = 'shipped';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case Refunded = 'refunded';

}
