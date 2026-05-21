<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    /**
     * Регистрация пользователя
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'min:6', 'confirmed'],
        ]);

        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'user',
        ]);

        // Auth::login($user);
        // $request->session()->regenerate();

        return $this->success([
            'message' => 'auth.registerSuccess',
            'user' => $user,
            // 'redirect' => '/dashboard',
        ]);
    }

    /**
     * Авторизация пользователя
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return $this->error(
                message: 'auth.invalidCredentials',
                code: 422,
            );
        }

        $user = Auth::user(); // или auth()->user() / $this->user()

        // Обновление сессии
        $request->session()->regenerate();

        return $this->success([
            'message' => 'auth.loginSuccess',
            'user' => $user,
        ]);
    }

    /**
     * Выход пользователя из системы
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // return response()->noContent();
        return $this->success([
            'message' => 'auth.logoutSuccess',
        ]);
    }

    /**
     * Получение текущего пользователя
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(
            $request->user()
        );
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
