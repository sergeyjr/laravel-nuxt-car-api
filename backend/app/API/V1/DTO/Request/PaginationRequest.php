<?php

namespace App\API\V1\DTO\Request;

use Illuminate\Http\Request;

class PaginationRequest
{

    public int $page = 1;
    public int $perPage = 5;
    public ?string $sort = null;
    public string $direction = 'asc';

    public function __construct(array $data = [])
    {
        $this->page = (int)($data['page'] ?? $this->page);
        $this->perPage = (int)($data['perPage'] ?? $this->perPage);

        $sort = $data['sort'] ?? null;

        if ($sort && str_starts_with($sort, '-')) {
            $this->sort = ltrim($sort, '-');
            $this->direction = 'desc';
        } else {
            $this->sort = $sort;
            $this->direction = strtolower($data['direction'] ?? 'asc');
        }
    }

}
