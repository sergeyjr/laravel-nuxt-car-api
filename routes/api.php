<?php

use App\API\V1\Controllers\ApiAuthController;
use App\API\V1\Controllers\ApiCarController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiteController;
use App\Http\Middleware\FixJsonMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;

// DDD
//use App\Http\Controllers\API\V1\ApiAuthController;
//use App\Http\Controllers\API\V1\ApiCarController;
//use App\Http\Controllers\Web\CarController;
//use App\Http\Controllers\Web\DashboardController;
//use App\Http\Controllers\Web\ProfileController;
//use App\Http\Controllers\Web\SiteController;
//use App\Http\Middleware\FixJsonMiddleware;
//use Illuminate\Support\Facades\Route;

Route::get('/cars', [CarController::class, 'list']);

Route::get('/cars/{id}', [CarController::class, 'show'])->whereNumber('id');

Route::get('/cars/latest', [CarController::class, 'latest']);

Route::get('/dashboard', [DashboardController::class, 'api']);

Route::get('/page/{code}', [SiteController::class, 'page']);

Route::post('/contact', [SiteController::class, 'sendContact'])
    ->middleware('throttle:contact_form');

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('profile')->group(function () {
        Route::post('/update', [ProfileController::class, 'update']);
        Route::post('/password', [ProfileController::class, 'password']);
        Route::delete('/', [ProfileController::class, 'destroy']);
    });
});

Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart/add', [CartController::class, 'add']);
Route::post('/cart/remove', [CartController::class, 'remove']);
Route::post('/cart/update', [CartController::class, 'update']);
Route::post('/cart/clear', [CartController::class, 'clear']);

Route::prefix('v1')->group(function () {

    // Авторизация пользователя
    Route::post('auth/login', [ApiAuthController::class, 'login']);

    // Доступ только для API пользователей
    Route::middleware(['auth:sanctum', 'api.role'])->group(function () {

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
            Route::get('generate-mock', [ApiCarController::class, 'generateMock']);

        });

    });

});
