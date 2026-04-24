<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    
    private function cart()
    {
        return Session::get('cart', []);
    }

    private function save($cart)
    {
        Session::put('cart', $cart);
    }

    public function index()
    {
        return response()->json($this->cart());
    }

    public function add(Request $request)
    {
        $cart = $this->cart();

        $id = $request->id;

        if (isset($cart[$id])) {
            $cart[$id]['qty'] += $request->qty ?? 1;
        } else {
            $cart[$id] = [
                'id' => $id,
                'name' => $request->name,
                'price' => $request->price,
                'qty' => $request->qty ?? 1,
            ];
        }

        $this->save($cart);

        return response()->json($cart);
    }

    public function update(Request $request)
    {
        $cart = $this->cart();

        $id = $request->id;

        if (isset($cart[$id])) {
            $cart[$id]['qty'] = max(1, $request->qty);
        }

        $this->save($cart);

        return response()->json($cart);
    }

    public function remove(Request $request)
    {
        $cart = $this->cart();

        unset($cart[$request->id]);

        $this->save($cart);

        return response()->json($cart);
    }

    public function clear()
    {
        Session::forget('cart');

        return response()->json([]);
    }

}
