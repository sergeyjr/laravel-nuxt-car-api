<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{

    protected $fillable = [
        'order_id',
        'car_id',
        'qty',
        'price'
    ];

    protected $appends = [
        'name',
        'photo_url',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class, 'car_id');
    }

    public function getNameAttribute(): string
    {
        return $this->car?->title ?? ('Машина #' . $this->car_id);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->car?->photo_url;
    }

}
