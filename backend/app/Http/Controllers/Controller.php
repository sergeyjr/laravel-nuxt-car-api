<?php

namespace App\Http\Controllers;

use App\API\V1\DTO\Request\PaginationRequest;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

abstract class Controller
{

    /**
     * Успешный JSON-ответ
     */
    protected function success(mixed $data = null, int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'errors' => null
        ], $code, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Ответ с ошибкой
     */
    protected function error(string $message, int $code = 400, mixed $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'data' => null,
            'errors' => $errors,
            'message' => $message,
        ], $code, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Текущий авторизованный пользователь
     */
    protected function user(): ?Authenticatable
    {
        return auth()->user();
    }

    /**
     * Проверка API-пользователя
     */
    protected function requireApiUser(): Authenticatable
    {
        $user = auth()->user();

        if (!$user || !$user->isApiUser()) {
            abort(403);
        }

        return $user;
    }

    /**
     * Создание DTO пагинации
     */
    protected function pagination(Request $request, int $size = 10): PaginationRequest
    {
        return new PaginationRequest([
            'page' => $request->query('page', 1),
            'perPage' => $size,
            'sort' => $request->query('sort', '-id'),
        ]);
    }
}
