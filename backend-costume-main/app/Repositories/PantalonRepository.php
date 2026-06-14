<?php

namespace App\Repositories;

use App\Models\Pantalon;
use App\Repositories\Contracts\PantalonRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class PantalonRepository implements PantalonRepositoryInterface
{
    protected Pantalon $model;

    public function __construct(Pantalon $model)
    {
        $this->model = $model;
    }

    public function getAllByUser(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->get();
    }

    public function findById(int $id): ?Pantalon
    {
        return $this->model->find($id);
    }

    public function create(array $data): Pantalon
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $pantalon = $this->findById($id);

        if (!$pantalon) {
            return false;
        }

        return $pantalon->update($data);
    }

    public function delete(int $id): bool
    {
        $pantalon = $this->findById($id);

        if (!$pantalon) {
            return false;
        }

        return $pantalon->delete();
    }

    public function getAll(): Collection
    {
        return $this->model->all();
    }
}
