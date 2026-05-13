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
        /**
         * Ограничение частоты отправки формы обратной связи
         * 1 запрос в 10 минут с одного IP
         */
        RateLimiter::for('contact_form', function (Request $request) {
            return Limit::perMinutes(10, 1)->by($request->ip());
        });
    }

}
