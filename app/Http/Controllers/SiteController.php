<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteController extends Controller
{

    public function home(): JsonResponse
    {
        return response()->json([
            'message' => 'Главная страница'
        ]);
    }

    public function page(string $code): JsonResponse
    {
        $page = Page::where('code', $code)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($page);
    }

    public function sendContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        Contact::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ваше сообщение успешно отправлено!'
        ]);
    }

}
