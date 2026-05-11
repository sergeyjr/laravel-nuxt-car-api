<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{

    public function index(Request $request)
    {

        $cart = Cart::where('user_id', $request->user()->id)
            ->with(['items' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->first();

        if (!$cart) {
            return response()->json([]);
        }

        $items = $cart->items->map(function ($item) {
            $mapped = [
                'id' => $item->car_id,
                'qty' => $item->qty,
                'price' => $item->price,
                'name' => $item->car->title ?? null,
                'photo_url' => $item->car->photo_url ?? null,
            ];
            return $mapped;
        });

        return response()->json($items);

    }

    public function add(Request $request)
    {

        $user = $request->user();

        $validated = $request->validate([
            'id' => ['required', 'integer', 'exists:cars,id'],
            'qty' => ['nullable', 'integer', 'min:1'],
        ]);

        $car = Car::find($validated['id']);

        if (!$car) {
            return response()->json([
                'message' => 'Машина не найдена'
            ], 404);
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

    public function update(Request $request)
    {

        $user = $request->user();

        $validated = $request->validate([
            'id' => ['required', 'integer', 'exists:cars,id'],
            'qty' => ['required', 'integer', 'min:1'],
        ]);

        $car = Car::find($validated['id']);

        if (!$car) {
            return response()->json([
                'message' => 'Машина не найдена.'
            ], 404);
        }

        $cart = Cart::firstOrCreate([
            'user_id' => $user->id
        ]);

        $qty = max(1, (int)$validated['qty']);

        $item = CartItem::firstOrNew([
            'cart_id' => $cart->id,
            'car_id' => $car->id,
        ]);

        $item->qty = $qty;
        $item->price = $car->price;

        $item->save();

        return $this->success();

    }

    public function remove(Request $request)
    {

        $cart = Cart::where('user_id', $request->user()->id)->first();

        if (!$cart) {
            return response()->json([]);
        }

        CartItem::where('cart_id', $cart->id)
            ->where('car_id', $request->id)
            ->delete();

        return $this->success();

    }

    public function clear(Request $request)
    {

        $cart = Cart::where('user_id', $request->user()->id)->first();

        if ($cart) {
            CartItem::where('cart_id', $cart->id)->delete();
        }

        return $this->success();

    }

}

