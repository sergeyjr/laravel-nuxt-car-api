<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CartItem extends Model
{

    use HasFactory;

    protected $fillable = [
        'cart_id',
        'car_id',
        'qty',
        'price',
    ];

    /**
     * Связь с корзиной
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Связь с автомобилем
     */
    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    /**
     * Общая стоимость позиции в корзине
     */
    public function getTotalAttribute()
    {
        return $this->price * $this->qty;
    }

}
