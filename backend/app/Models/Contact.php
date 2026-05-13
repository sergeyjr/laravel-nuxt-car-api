<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{

    /**
     * Таблица в базе данных
     */
    protected $table = 'contacts';

    /**
     * Поля, доступные для массового заполнения
     */
    protected $fillable = [
        'name',
        'email',
        'subject',
        'body',
    ];

}
