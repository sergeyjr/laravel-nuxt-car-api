<?php

namespace App\Enums;

enum PaymentMethod: string
{

    /**
     * Оплата банковской картой
     */
    case CARD = 'card';

    /**
     * Оплата наличными
     */
    case CASH = 'cash';

    /**
     * Оплата через PayPal
     */
    case PAYPAL = 'paypal';

}
