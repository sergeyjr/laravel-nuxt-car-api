<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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

        // АВТОЛОГИН ПОСЛЕ РЕГИСТРАЦИИ (опционально)
        // Auth::login($user);
        // $request->session()->regenerate();

        // $token = $user->createToken('web_session_token')->plainTextToken;

        return $this->success([
            'user' => $user,
            'message' => 'Регистрация успешно завершена! Теперь вы можете войти.',
            // 'token' => $token,
            // 'redirect' => '/dashboard',
        ]);

    }

    public function login(Request $request): JsonResponse
    {

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Auth::guard('web')->login($user);
        // $request->session()->regenerate();

        $user->tokens()->where('name', 'web_session_token')->delete();

        // TODO: выпилить этот токен
        $token = $user->createToken('web_session_token')->plainTextToken;

        return $this->success([
            'user' => $user,
            'message' => 'Успешный вход.',
            'token' => $token,
        ]);

    }

    public function logout(Request $request): JsonResponse
    {

        $user = auth()->user();

        $user?->tokens()->where('name', 'web_session_token')->delete();

        // Auth::logout(); // web guard (способ входа и проверки пользователя)

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->success([
            'message' => 'Выход из системы.'
        ]);

    }

    public function me(Request $request): JsonResponse
    {

        return $this->success($request->user());

    }

}
