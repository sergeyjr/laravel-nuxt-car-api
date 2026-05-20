<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{

    /**
     * Поля, доступные для массового заполнения
     */
    protected $fillable = [
        'order_id',
        'car_id',
        'qty',
        'price'
    ];

    /**
     * Вычисляемые поля, добавляемые в JSON-ответ
     */
    protected $appends = [
        'name',
        'photo_url',
    ];

    /**
     * Связь с заказом
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Связь с автомобилем
     */
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class, 'car_id');
    }

    /**
     * Название товара (автомобиля) в заказе
     * Если автомобиль удалён — возвращается fallback
     */
    public function getNameAttribute(): string
    {
        return $this->car?->title ?? ('Машина #' . $this->car_id);
    }

    /**
     * URL изображения автомобиля
     */
    public function getPhotoUrlAttribute(): ?string
    {
        return $this->car?->photo_url;
    }

}
