<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

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

    public function login(Request $request): JsonResponse
    {

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(
                ['message' => 'Имя пользователя и пароль не совпадают.'],
                422
            );
        }

        $user = Auth::user(); // или auth()->user()

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false
            ], 401);
        }

        $request->session()->regenerate();

        return $this->success([
            'user' => $user,
            'message' => 'Авторизация прошла успешна.'
        ]);

    }

    public function logout(Request $request): JsonResponse
    {

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->success();

    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

}
