<?php

namespace App\API\V1\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $title
 * @property string $description
 * @property float $price
 * @property string $photo_url
 * @property string $contacts
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property-read \App\API\V1\Models\CarOptionModel|null $options
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel whereContacts($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel wherePhotoUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarModel whereUserId($value)
 * @mixin \Eloquent
 */
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
