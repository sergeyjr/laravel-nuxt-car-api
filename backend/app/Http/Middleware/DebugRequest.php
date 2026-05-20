<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DebugRequest
{

    public function handle($request, Closure $next)
    {
        logger('REQUEST DEBUG', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'all' => $request->all(),
            'raw' => $request->getContent(),
            'headers' => $request->headers->all(),
        ]);

        return $next($request);
    }

}
