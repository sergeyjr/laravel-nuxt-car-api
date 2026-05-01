<?php

use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

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

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

Route::get('/files/{path}', [FileController::class, 'show'])
    ->where('path', '.*');
