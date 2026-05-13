<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
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

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'user',
        ]);

        // Auth::login($user);
        // $request->session()->regenerate();

        return $this->success([
            'user' => $user,
            'message' => 'Регистрация успешно завершена! Теперь вы можете войти.',
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

        // Проверка email/password
        if (!Auth::attempt($credentials)) {
            return $this->error(
                'Имя пользователя и пароль не совпадают.',
                422
            );
        }

        $user = Auth::user(); // или auth()->user()

        // Обновление сессии
        $request->session()->regenerate();

        return $this->success([
            'message' => 'Авторизация прошла успешна.',
            'user' => $user,
        ]);
    }

    /**
     * Выход пользователя из системы
     */
    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    /**
     * Получение текущего пользователя
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->success($user);
    }

}
