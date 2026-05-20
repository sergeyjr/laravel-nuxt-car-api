<?php

namespace App\Enums;

enum DeliveryStatus: string
{

    /**
     * Новая доставка
     */
    case NEW = 'new';

    /**
     * В пути
     */
    case IN_TRANSIT = 'in_transit';

    /**
     * Доставлено
     */
    case DELIVERED = 'delivered';

}
