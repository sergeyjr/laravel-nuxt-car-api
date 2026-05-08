<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
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

Route::get('/files/{path}', [FileController::class, 'show'])
    ->where('path', '.*');
