<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{

    public function handle(Request $request, Closure $next)
    {
        $locale = $request->header('X-Locale', 'ru');

        if (!in_array($locale, ['ru', 'en'])) {
            $locale = 'ru';
        }

        app()->setLocale($locale);

        return $next($request);
    }

}
