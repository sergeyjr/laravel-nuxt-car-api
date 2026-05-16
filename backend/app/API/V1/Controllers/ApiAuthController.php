<?php

namespace App\API\V1\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ApiAuthController extends Controller
{

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        /** @var User $user */
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return $this->error(
                'Неверные учетные данные.',
                401
            );
        }

        if (!$user->isAdmin() && !$user->isApiUser()) {
            return $this->error(
                'Запрещено: нет доступа к API.',
                403
            );
        }

        // удаляем старые токены (по желанию)
        $user->tokens()->where('name', 'api_token')->delete();

        $token = $user->createToken('api_token')->plainTextToken;

        return $this->success([
            'message' => 'Токен успешно получен.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        if ($request->user()?->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return $this->success([
            'message' => 'Успешный выход.'
        ]);
    }

//    public function token(Request $request)
//    {
//        $user = $request->user();
//
//        if (!$user) {
//            return $this->error(
//                'Требуется авторизация.',
//                401
//            );
//        }
//
//        if (!$user->isAdmin() && !$user->isApiUser()) {
//            return $this->error(
//                'Доступ запрещен.',
//                403);
//        }
//
//        $token = $user->tokens()
//            ->where('name', 'api_token')
//            ->latest()
//            ->first();
//
//        if ($token) {
//            return $this->success([
//                'token' => $token->token
//            ]);
//        }
//
//        $plain = $user->createToken('api_token')->plainTextToken;
//
//        return $this->success([
//            'token' => $plain,
//        ]);
//    }

}
