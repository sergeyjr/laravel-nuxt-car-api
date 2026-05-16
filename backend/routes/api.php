<?php

use App\API\V1\Controllers\ApiAuthController;
use App\API\V1\Controllers\ApiCarController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiteController;
use App\Http\Middleware\FixJsonMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * routes/api.php
 *
 * Используется для:
 *
 * SPA (Nuxt, Vue, React)
 * JSON API
 * stateless запросы
 * обычно prefix /api
 */

/*
|--------------------------------------------------------------------------
| AUT LOGIN, REGISTER
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

/*
|--------------------------------------------------------------------------
| PUBLIC API (без авторизации)
|--------------------------------------------------------------------------
*/

Route::get('/cars', [CarController::class, 'list']);
Route::get('/cars/{id}', [CarController::class, 'show'])->whereNumber('id');
Route::get('/cars/latest', [CarController::class, 'latest']);

Route::get('/page/{code}', [SiteController::class, 'page']);

Route::post('/contact', [SiteController::class, 'sendContact'])
    ->middleware('throttle:contact_form');

/*
|--------------------------------------------------------------------------
| AUTHENTICATED SPA AREA (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->group(function () {

    // Car
    Route::prefix('car')->group(function () {
        Route::post('create', [ApiCarController::class, 'create']); // метод из api V1
        Route::get('generate', [CarController::class, 'generateMock']);
    });

    // Cart
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add', [CartController::class, 'add']);
        Route::post('/remove', [CartController::class, 'remove']);
        Route::post('/update', [CartController::class, 'update']);
        Route::post('/clear', [CartController::class, 'clear']);
    });

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index']);
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/checkout', [OrderController::class, 'checkout']);
        Route::get('/{id}', [OrderController::class, 'show']);
    });

    // Profile
    Route::prefix('profile')->group(function () {
        Route::delete('/', [ProfileController::class, 'destroy']);
        Route::post('/password', [ProfileController::class, 'password']);
        Route::post('/update', [ProfileController::class, 'update']);
    });

});

/*
|--------------------------------------------------------------------------
| API V1 (token-based / external API)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Авторизация пользователя
    Route::prefix('auth')->group(function () {
        Route::post('login', [ApiAuthController::class, 'login']);
    });

    // Доступ только для API пользователей
    Route::middleware(['auth:sanctum', 'api.role'])->group(function () {

        // Получение токена с фронта сайта
        // Route::get('token', [ApiAuthController::class, 'token']);

        Route::prefix('car')->group(function () {

            // Получение списка машин
            Route::get('list', [ApiCarController::class, 'list']);

            // Получение машины по ID
            Route::get('{id}', [ApiCarController::class, 'show'])->whereNumber('id');

            // Middleware только там, где есть JSON
            Route::middleware([FixJsonMiddleware::class])->group(function () {

                // Создание машины
                Route::post('create', [ApiCarController::class, 'create']);

                // Обновление машины (полное)
                Route::put('update/{id}', [ApiCarController::class, 'update'])->whereNumber('id');

                // Обновление машины (частичное)
                Route::patch('update/{id}', [ApiCarController::class, 'patch'])->whereNumber('id');

            });

            // Удаление машины
            Route::delete('delete/{id}', [ApiCarController::class, 'destroy'])->whereNumber('id');

            // Генерация тестовых данных
            // Route::get('generate-mock', [ApiCarController::class, 'generateMock']);

        });

    });

});
