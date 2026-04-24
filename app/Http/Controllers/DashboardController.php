<?php

namespace App\Http\Controllers;

use App\API\V1\Services\CarService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{

    public function api(CarService $carService): JsonResponse
    {
        return response()->json([
            'message' => 'Защищенные данные.',
            'user' => auth()->user(),
            'carsCount' => $carService->getCarsCount(),
        ]);
    }

}
