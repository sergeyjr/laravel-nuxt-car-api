<?php

namespace App\API\V1\Repositories;

use App\API\V1\Exceptions\RepositoryException;
use App\API\V1\Models\CarOptionModel;
use App\API\V1\Repositories\Interfaces\CarOptionRepositoryInterface;

class CarOptionRepository implements CarOptionRepositoryInterface
{

    /**
     * Сохранение характеристик автомобиля
     *
     * @throws RepositoryException
     */
    public function saveOptions(int $carId, array $data): array
    {
        // Создание новой модели опций автомобиля
        $options = new CarOptionModel();

        $options->car_id = $carId;

        // Основные характеристики автомобиля
        $options->brand = $data['brand'];
        $options->model = $data['model'];
        $options->year = $data['year'];
        $options->body = $data['body'];
        $options->mileage = $data['mileage'];

        // Сохранение в базу данных
        if (!$options->save()) {
            throw new RepositoryException('Не удалось сохранить характеристики автомобиля');
        }

        return $options->toArray();
    }

}
