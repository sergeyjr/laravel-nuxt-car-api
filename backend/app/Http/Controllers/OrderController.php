<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{

    /**
     * Оформление заказа из корзины
     * @throws \Throwable
     */
    public function checkout(Request $request): JsonResponse
    {
        $user = $request->user();

        return DB::transaction(function () use ($request, $user) {

            $cart = Cart::query()
                ->where('user_id', $user->id)
                ->with('items')
                ->first();

            if (!$cart || $cart->items->isEmpty()) {
                return $this->error(
                    'cart.emptyTitle',
                    422
                );
            }

            $order = Order::create([
                'user_id' => $user->id,
                'total' => $cart->items->sum(fn ($item) => $item->price * $item->qty),
                'status' => OrderStatus::PendingPayment->value,
                'comment' => $request->input('comment'),
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'car_id' => $item->car_id,
                    'qty' => $item->qty,
                    'price' => $item->price,
                ]);
            }

            $cart->items()->delete();

            return $this->success([
                'message' => 'order.successTitle',
                'order' => $order->load(['items.car']),
            ]);
        });
    }

    /**
     * Получение списка заказов пользователя
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->with(['items.car'])
            ->latest()
            ->get();

        return $this->success($orders);
    }

    /**
     * Получение одного заказа
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::query()
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with(['items.car'])
            ->firstOrFail();

        return $this->success($order);
    }

}
