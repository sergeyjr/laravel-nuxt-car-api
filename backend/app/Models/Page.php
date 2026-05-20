<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{

    /**
     * Таблица страниц
     */
    protected $table = 'pages';

    /**
     * Поля, доступные для массового заполнения
     */
    protected $fillable = [
        'code',
        'title',
        'content',
        'is_active',
    ];

}
