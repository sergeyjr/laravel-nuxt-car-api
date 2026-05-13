<?php

namespace App\API\V1\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $car_id
 * @property string $brand
 * @property string $model
 * @property int $year
 * @property string $body
 * @property int $mileage
 * @property-read \App\API\V1\Models\CarModel $car
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarOptionModel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarOptionModel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarOptionModel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarOptionModel whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarOptionModel whereBrand($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarOptionModel whereCarId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarOptionModel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarOptionModel whereMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarOptionModel whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarOptionModel whereYear($value)
 * @mixin \Eloquent
 */
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
