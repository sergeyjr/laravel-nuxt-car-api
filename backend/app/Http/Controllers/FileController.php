<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class FileController
{

    /**
     * Отдача файла по пути из storage
     */
    public function show($path)
    {
        // Ограничение доступа только к папке uploads
        if (!str_starts_with($path, 'uploads/')) {
            abort(403);
        }

        // Проверка существования файла
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        // Возврат файла как HTTP-ответа
        return Storage::disk('public')->response($path);
    }

}
