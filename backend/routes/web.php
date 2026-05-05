<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Route;

/*
 * routes/web.php
 *
 * Используется для:
 *
 * Blade / серверные страницы
 * сессии (cookie-based web auth)
 * CSRF обязателен
 * SSR/HTML ответы
 */

//Route::get('/sanctum/csrf-cookie', function () {
//    return response()->json(['message' => 'CSRF cookie set']);
//});

/*
|--------------------------------------------------------------------------
| AUT LOGIN, REGISTER
|--------------------------------------------------------------------------
*/

// TODO: перенести в api.php
Route::prefix('auth')->group(function () {

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

});

Route::get('/files/{path}', [FileController::class, 'show'])
    ->where('path', '.*');
