<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Car;

class DashboardController extends Controller
{

    public function api(Request $request): JsonResponse
    {

        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $carsCount = Car::count();
        $myCarsCount = Car::where('user_id', $user->id)->count();

        $orders = Order::where('user_id', $user->id)
            ->latest()
            ->take(3)
            ->get()
            ->map(fn($o) => [
                'id' => $o->id,
                'total' => $o->total ?? null,
                'status' => $o->status ?? null,
                'created_at' => $o->created_at,
            ]);

        $ordersCount = Order::where('user_id', $user->id)->count();

        $cart = Cart::where('user_id', $user->id)
            ->with('items.car')
            ->first();

        $cartItems = [];
        $cartTotal = 0;

        if ($cart) {
            foreach ($cart->items as $item) {
                $cartItems[$item->car_id] = [
                    'id' => $item->car_id,
                    'qty' => $item->qty,
                    'price' => $item->price,
                    'name' => $item->car->title ?? null,
                ];

                $cartTotal += $item->price * $item->qty;
            }
        }

        return response()->json([
            'carsCount' => $carsCount,
            'myCarsCount' => $myCarsCount,
            'ordersCount' => $ordersCount,
            'orders' => $orders,
            'cart' => $cartItems,
            'cartTotal' => $cartTotal,
        ]);
    }

}
