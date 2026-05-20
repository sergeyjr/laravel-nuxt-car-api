<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{

    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
    ];

    /**
     * Товары в корзине
     */
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Владелец корзины (пользователь)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Общая стоимость корзины
     */
    public function getTotalAttribute()
    {
        return $this->items->sum(function ($item) {
            return $item->price * $item->qty;
        });
    }

}
