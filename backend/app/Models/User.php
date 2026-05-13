<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{

    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Таблица пользователей
     */
    protected $table = 'users';

    /**
     * Поля, доступные для массового заполнения
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * Скрытые поля при сериализации
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Приведение типов атрибутов модели
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Проверка роли администратора
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Проверка API-пользователя
     */
    public function isApiUser(): bool
    {
        return $this->role === 'api';
    }

    /**
     * Проверка обычного пользователя
     */
    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Корзина пользователя
     */
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

}
