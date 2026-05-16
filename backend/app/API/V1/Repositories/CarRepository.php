<?php

namespace App\API\V1\Repositories;

use App\API\V1\Models\CarModel;
use App\API\V1\Repositories\Interfaces\CarRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class CarRepository implements CarRepositoryInterface
{

    /**
     * Репозиторий опций автомобиля
     */
    private CarOptionRepository $optionRepository;

    public function __construct(CarOptionRepository $optionRepository)
    {
        $this->optionRepository = $optionRepository;
    }

    /**
     * Создание автомобиля
     */
    public function save(array $data): array
    {
        return DB::transaction(function () use ($data) {

            $car = new CarModel();

            // Заполнение основных данных автомобиля
            $car->fill([
                'title' => $data['title'],
                'description' => $data['description'],
                'price' => $data['price'],
                'photo_url' => $data['photo_url'],
                'contacts' => $data['contacts'],
                'user_id' => $data['user_id'] ?? null,
            ]);

            $car->save();

            // Сохранение характеристик автомобиля (опции)
            if (!empty($data['options'])) {
                $this->optionRepository->saveOptions($car->id, $data['options']);
            }

            return $car->load('options')->toArray();
        });
    }

    /**
     * Обновление автомобиля (полное)
     */
    public function update(int $id, array $data): ?array
    {
        return DB::transaction(function () use ($id, $data) {

            // Получение автомобиля вместе с опциями
            $car = CarModel::with('options')->find($id);

            if (!$car) {
                return null;
            }

            // Обновление основных данных автомобиля
            $car->update([
                'title' => $data['title'],
                'description' => $data['description'],
                'price' => $data['price'],
                'photo_url' => $data['photo_url'],
                'contacts' => $data['contacts'],
                'user_id' => $data['user_id'] ?? null,
            ]);

            // Обновление опций (перезапись)
            if (!empty($data['options'])) {

                $car->option()->delete();

                $this->optionRepository->saveOptions($car->id, $data['options']);
            }

            return $car->load('options')->toArray();
        });
    }

    /**
     * Частичное обновление автомобиля
     */
    public function patch(int $id, array $data): ?array
    {
        return DB::transaction(function () use ($id, $data) {

            // Получение автомобиля с опциями
            $car = CarModel::with('options')->find($id);

            if (!$car) {
                return null;
            }

            // Обновление только переданных полей
            $car->update(array_filter([
                'title' => $data['title'] ?? null,
                'description' => $data['description'] ?? null,
                'price' => $data['price'] ?? null,
                'photo_url' => $data['photo_url'] ?? null,
                'contacts' => $data['contacts'] ?? null,
            ], fn($v) => $v !== null));

            // Частичное обновление опций
            if (!empty($data['options'])) {

                $car->option()->updateOrCreate([],
                    array_filter([
                        'brand' => $data['options']['brand'] ?? null,
                        'model' => $data['options']['model'] ?? null,
                        'year' => $data['options']['year'] ?? null,
                        'body' => $data['options']['body'] ?? null,
                        'mileage' => $data['options']['mileage'] ?? null,
                    ], fn($v) => $v !== null)
                );
            }

            return $car->load('options')->toArray();
        });
    }

    /**
     * Удаление автомобиля
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {

            // Поиск автомобиля с опциями
            $car = CarModel::with('options')->find($id);

            if (!$car) {
                return false;
            }

            // Удаление опций автомобиля
            $car->option()->delete();

            // Удаление автомобиля
            $car->delete();

            return true;
        });
    }

    /**
     * Получение автомобиля по ID
     */
    public function findById(int $id): ?array
    {
        $car = CarModel::with('options')->find($id);

        return $car?->toArray();
    }

    /**
     * Базовый query для списка автомобилей
     */
    public function getQuery(): Builder
    {
        return CarModel::with('options');
    }

}
