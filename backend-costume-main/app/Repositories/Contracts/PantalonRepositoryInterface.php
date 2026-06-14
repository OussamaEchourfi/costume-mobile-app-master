<?php

namespace App\Repositories\Contracts;

use App\Models\Pantalon;
use Illuminate\Database\Eloquent\Collection;

interface PantalonRepositoryInterface
{
    public function getAllByUser(int $userId): Collection;
    public function findById(int $id): ?Pantalon;
    public function create(array $data): Pantalon;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function getAll();
}
