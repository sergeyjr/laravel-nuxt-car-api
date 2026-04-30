<?php

use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Route;

Route::get('/files/{path}', [FileController::class, 'show'])
    ->where('path', '.*');
