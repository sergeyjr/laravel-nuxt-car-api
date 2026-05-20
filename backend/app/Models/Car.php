<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{

    /**
     * Таблица, связанная с моделью
     */
    protected $table = 'cars';

    /**
     * Позиции корзины, связанные с автомобилем
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

}
