<?php

namespace App\Providers;

use App\API\V1\Repositories\CarOptionRepository;
use App\API\V1\Repositories\CarRepository;
use App\API\V1\Repositories\Interfaces\CarOptionRepositoryInterface;
use App\API\V1\Repositories\Interfaces\CarRepositoryInterface;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

    /**
     * Регистрация сервисов приложения
     */
    public function register(): void
    {

        // Привязка репозитория автомобилей к интерфейсу
        $this->app->bind(CarRepositoryInterface::class, CarRepository::class);

        // Привязка репозитория опций автомобилей к интерфейсу
        $this->app->bind(CarOptionRepositoryInterface::class, CarOptionRepository::class);

    }

    /**
     * Инициализация сервисов приложения
     */
    public function boot(): void
    {

        RateLimiter::for('contact_form', function (Request $request) {
            $config = config('rate_limits.contact_form');

            return Limit::perMinutes(
                $config['decay_minutes'],
                $config['attempts']
            )->by($this->contactRateLimitKey($request));
        });

    }

    /**
     * Возвращает ключ ограничения частоты отправки формы контакта.
     * Используется Laravel RateLimiter и IP пользователя.
     */
    protected function contactRateLimitKey(Request $request): string
    {
        return $request->ip();
    }

}
