<?php

namespace App\Http\Controllers;

use App\API\V1\DTO\Request\PaginationRequest;
use App\API\V1\Services\CarService;
use Database\Seeders\CarSeeder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CarController extends Controller
{

    /**
     * Внедрение сервиса машин
     */
    public function __construct(
        private readonly CarService $service
    )
    {
    }

    /**
     * Получение списка машин
     */
    public function list(Request $request): JsonResponse
    {
        $pagination = new PaginationRequest([
            'page' => $request->query('page', 1),
            'perPage' => 9,
            'sort' => $request->query('sort', '-id'),
        ]);

        $cars = $this->service->getCars($pagination);

        return $this->success($cars);
    }

    /**
     * Получение одной машины
     */
    public function show(int $id): JsonResponse
    {
        $car = $this->service->getCar((int)$id);

        if (!$car) {
            return $this->error(
                'Машина не найдена.',
                404
            );
        }

        return $this->success($car);
    }

    /**
     * Получение последних добавленных машин
     */
    public function latest(): JsonResponse
    {
        $pagination = new PaginationRequest([
            'page' => 1,
            'perPage' => 6,
            'sort' => '-id',
        ]);

        $cars = $this->service->getCars($pagination);

        return $this->success($cars);
    }

    public function generateMock(): JsonResponse
    {
        $seeder = new CarSeeder();
        $cars = $seeder->cars;

        $car = $cars[array_rand($cars)];

        [$brand, $model] = explode(' ', $car[0]) + [null, null];

        return $this->success([
            'data' => [
                'title' => $car[0],
                'description' => $car[1],
                'price' => $car[2],
                'photo_url' => $seeder->photoUrlDefault,
                'contacts' => $seeder->emailDefault,
                'options' => [
                    'brand' => $brand,
                    'model' => $model,
                    'year' => 2020,
                    'body' => $car[3],
                    'mileage' => 50000,
                ]
            ]
        ]);
    }

}
