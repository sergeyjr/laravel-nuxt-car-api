<?php

namespace App\API\V1\Services;

use App\API\V1\DTO\Request\CarOptionRequest;
use App\API\V1\DTO\Request\PaginationRequest;
use App\API\V1\Repositories\Interfaces\CarRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;

class CarService
{
    private const CACHE_TTL = 60;

    public function __construct(
        private readonly CarRepositoryInterface $repository
    )
    {
    }

    /**
     * Получение одной записи автомобиля по ID.
     * Использует кеширование для ускорения повторных запросов.
     */
    public function getCar(int $id): ?array
    {
        $cacheKey = "car:$id";

        try {
            return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($id) {
                return $this->repository->findById($id);
            });
        } catch (\Throwable $e) {
            return $this->repository->findById($id);
        }
    }

    /**
     * Получение списка автомобилей с пагинацией и сортировкой.
     */
    public function getCars(PaginationRequest $pagination): LengthAwarePaginator
    {
        $query = $this->repository->getQuery();

        $this->applySort($query, $pagination->sort, $pagination->direction);

        return $query->paginate(
            $pagination->perPage,
            ['*'],
            'page',
            $pagination->page
        );
    }

    /**
     * Создание нового автомобиля.
     * Обрабатывает вложенные options через DTO и инвалидирует кеш.
     */
    public function createCar(array $data): array
    {
        $options = null;

        if (!empty($data['options'])) {
            $dto = CarOptionRequest::fromArray($data['options']);
            $options = $dto->toArray();
        }

        $data['options'] = $options;

        $car = $this->repository->save($data);

        try {
            Cache::forget("car:{$car['id']}");
        } catch (\Throwable $e) {
            // ignore cache failure
        }

        return $car;
    }

    /**
     * Полное обновление автомобиля.
     * Проверяет владельца, пересобирает options и инвалидирует кеш.
     */
    public function updateCar(int $id, array $data): array|string|null
    {
        $car = $this->repository->findById($id);

        if (!$car) {
            return 'not_found';
        }

        if (($car['user_id'] ?? null) !== auth()->id()) {
            return 'forbidden';
        }

        $options = null;

        if (!empty($data['options'])) {
            $dto = CarOptionRequest::fromArray($data['options']);
            $options = $dto->toArray();
        }

        $data['options'] = $options;

        $car = $this->repository->update($id, $data);

        try {
            Cache::forget("car:{$car['id']}");
        } catch (\Throwable $e) {
            // ignore cache failure
        }

        return $car;
    }

    /**
     * Частичное обновление автомобиля (PATCH).
     * Удаляет null-поля и сохраняет только переданные данные.
     */
    public function patchCar(int $id, array $data): array|string|null
    {
        $car = $this->repository->findById($id);

        if (!$car) {
            return 'not_found';
        }

        if (($car['user_id'] ?? null) !== auth()->id()) {
            return 'forbidden';
        }

        $options = null;

        if (!empty($data['options'])) {
            $dto = CarOptionRequest::fromArray($data['options']);
            $options = $dto->toArray();
        }

        $data['options'] = $options;
        $data = array_filter($data, fn($v) => $v !== null);

        $car = $this->repository->patch($id, $data);

        try {
            Cache::forget("car:{$car['id']}");
        } catch (\Throwable $e) {
            // ignore cache failure
        }

        return $car;
    }

    /**
     * Удаление автомобиля.
     * Проверяет владельца и удаляет запись из хранилища.
     */
    public function deleteCar(int $id): array|string|null
    {
        $car = $this->repository->findById($id);

        if (!$car) {
            return 'not_found';
        }

        if (($car['user_id'] ?? null) !== auth()->id()) {
            return 'forbidden';
        }

        try {
            Cache::forget("car:{$car['id']}");
        } catch (\Throwable $e) {
            // ignore cache failure
        }

        return $this->repository->delete($id);
    }

    /**
     * Применение сортировки к query builder.
     * Ограничивает допустимые поля сортировки.
     */
    private function applySort(Builder $query, ?string $sort, string $direction = 'asc'): void
    {
        if (!$sort) {
            return;
        }

        $sort = trim($sort);
        $isDesc = str_starts_with($sort, '-');

        if ($isDesc) {
            $sort = ltrim($sort, '-');
            $direction = 'desc';
        }

        $allowedPublicSorts = ['id', 'title', 'created_at'];
        $allowedAuthSorts = ['price'];

        $allowed = $allowedPublicSorts;

        if (Auth::check()) {
            $allowed = array_merge($allowed, $allowedAuthSorts);
        }

        if (!in_array($sort, $allowed, true)) {
            return;
        }

        $query->orderBy($sort, $direction);
    }

}
