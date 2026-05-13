<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Car;

class DashboardController extends Controller
{

    /**
     * Данные dashboard пользователя
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Проверка авторизации
        if (!$user) {
            return $this->error(
                'Требуется авторизация.',
                401
            );
        }

        // Общее количество машин
        $carsCount = Car::count();

        // Количество машин пользователя
        $myCarsCount = Car::where('user_id', $user->id)->count();

        // Последние заказы пользователя
        $orders = Order::where('user_id', $user->id)
            ->latest()
            //->take(3)
            ->get()
            ->map(fn($o) => [
                'id' => $o->id,
                'total' => $o->total ?? null,
                'status' => $o->status ?? null,
                'created_at' => $o->created_at,
            ]);

        // Количество заказов пользователя
        $ordersCount = Order::where('user_id', $user->id)->count();

        // Корзина пользователя
        $cart = Cart::where('user_id', $user->id)
            ->with('items.car')
            ->first();

        $cartItems = [];
        $cartTotal = 0;

        // Формирование данных корзины
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

        // Ответ dashboard
        return $this->success([
            'carsCount' => $carsCount,
            'myCarsCount' => $myCarsCount,
            'ordersCount' => $ordersCount,
            'orders' => $orders,
            'cart' => $cartItems,
            'cartTotal' => $cartTotal,
        ]);
    }

}
