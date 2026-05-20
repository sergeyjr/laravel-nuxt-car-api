<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{

    /**
     * Поля, доступные для массового заполнения
     */
    protected $fillable = [
        'user_id',
        'total',
        'status',
        'comment'
    ];

    /**
     * Позиции заказа (товары в заказе)
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

}
