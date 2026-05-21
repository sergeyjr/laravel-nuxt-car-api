<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{

    /**
     * Обновление профиля (имя, аватар)
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:65536'],
            'remove_avatar' => ['nullable', 'boolean'],
        ]);

        if ($request->has('email')) {
            return $this->error(
                'profile.emailChangeForbidden',
                403
            );
        }

        $user->name = $validated['name'];

        if (!empty($validated['remove_avatar']) && $user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->avatar = null;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->save();

        return $this->success([
            'message' => 'profile.updated',
            'user' => $user,
        ]);
    }

    /**
     * Смена пароля
     */
    public function password(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', Password::min(6)],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return $this->error(
                'profile.currentPasswordIncorrect',
                422
            );
        }

        if (Hash::check($validated['password'], $user->password)) {
            return $this->error(
                'profile.newPasswordSameAsOld',
                422
            );
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return $this->success([
            'message' => 'profile.passwordUpdated',
        ]);
    }

    /**
     * Удаление аккаунта
     */
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        Auth::logout();

        if ($user?->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user?->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->success([
            'message' => 'profile.deleted',
            'redirect' => '/',
        ]);
    }

}
