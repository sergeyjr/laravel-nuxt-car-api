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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
});

Route::get('/files/{path}', [FileController::class, 'show'])
    ->where('path', '.*');
