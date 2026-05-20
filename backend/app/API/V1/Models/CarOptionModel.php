<?php

namespace App\API\V1\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarOptionModel extends Model
{

    /**
     * Таблица характеристик автомобилей
     */
    protected $table = 'car_options';

    /**
     * Отключение timestamps (нет created_at / updated_at в таблице)
     */
    public $timestamps = false;

    /**
     * Поля, доступные для массового заполнения
     */
    protected $fillable = [
        'car_id',
        'brand',
        'model',
        'year',
        'body',
        'mileage',
    ];

    /**
     * Приведение типов атрибутов модели
     */
    protected $casts = [
        'year' => 'integer',
        'mileage' => 'integer',
    ];

    /**
     * Связь с автомобилем
     */
    public function car(): BelongsTo
    {
        return $this->belongsTo(CarModel::class);
    }

}
