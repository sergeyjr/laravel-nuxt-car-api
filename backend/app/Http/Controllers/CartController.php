<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{

    /**
     * Получение корзины пользователя
     */
    public function index(Request $request): JsonResponse
    {
        $cart = Cart::where('user_id', $request->user()->id)
            ->with([
                'items.car',
                'items' => function ($query) {
                    $query->orderBy('created_at', 'asc');
                }
            ])
            ->first();

        if (!$cart) {
            return $this->success();
        }

        $items = $cart->items->map(function ($item) {
            return [
                'id' => $item->car_id,
                'qty' => $item->qty,
                'price' => $item->price,
                'name' => $item->car->title ?? null,
                'photo_url' => $item->car->photo_url ?? null,
            ];
        });

        return $this->success($items);
    }

    /**
     * Добавление товара в корзину
     */
    public function add(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'id' => ['required', 'integer', 'exists:cars,id'],
            'qty' => ['nullable', 'integer', 'min:1'],
        ]);

        $car = Car::find($validated['id']);

        if (!$car) {
            return $this->error(
                'Машина не найдена.',
                404
            );
        }

        $cart = Cart::firstOrCreate([
            'user_id' => $user->id
        ]);

        $qty = max(1, (int)($validated['qty'] ?? 1));

        $item = CartItem::firstOrNew([
            'cart_id' => $cart->id,
            'car_id' => $car->id,
        ]);

        $item->qty = ($item->exists ? (int)$item->qty : 0) + $qty;
        $item->price = $car->price;

        $item->save();

        return $this->success();
    }

    /**
     * Обновление количества товара в корзине
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'id' => ['required', 'integer', 'exists:cars,id'],
            'qty' => ['required', 'integer', 'min:1'],
        ]);

        $car = Car::find($validated['id']);

        if (!$car) {
            return $this->error(
                'Машина не найдена.',
                404
            );
        }

        $cart = Cart::firstOrCreate([
            'user_id' => $user->id
        ]);

        $item = CartItem::firstOrNew([
            'cart_id' => $cart->id,
            'car_id' => $car->id,
        ]);

        $item->qty = (int)$validated['qty'];
        $item->price = $car->price;

        $item->save();

        return $this->success();
    }

    /**
     * Удаление товара из корзины
     */
    public function remove(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['required', 'integer', 'exists:cars,id'],
        ]);

        $cart = Cart::where('user_id', $request->user()->id)->first();

        if (!$cart) {
            return $this->success();
        }

        CartItem::where('cart_id', $cart->id)
            ->where('car_id', $validated['id'])
            ->delete();

        return $this->success();
    }

    /**
     * Полная очистка корзины
     */
    public function clear(Request $request): JsonResponse
    {
        $cart = Cart::where('user_id', $request->user()->id)->first();

        if ($cart) {
            CartItem::where('cart_id', $cart->id)->delete();
        }

        return $this->success();
    }
}
