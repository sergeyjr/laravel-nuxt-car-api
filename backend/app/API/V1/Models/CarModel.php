<?php

namespace App\API\V1\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CarModel extends Model
{

    /**
     * Таблица автомобилей
     */
    protected $table = 'cars';

    /**
     * Поля, доступные для массового заполнения
     */
    protected $fillable = [
        'title',
        'description',
        'price',
        'photo_url',
        'contacts',
        'user_id',
    ];

    /**
     * Приведение типов атрибутов модели
     */
    protected $casts = [
        'price' => 'float',
        'created_at' => 'datetime',
    ];

    /**
     * Дополнительные опции автомобиля
     */
    public function options(): HasOne
    {
        return $this->hasOne(CarOptionModel::class, 'car_id', 'id');
    }

}
