<?php

namespace App\Services;

use App\Models\Pantalon;
use App\Repositories\PantalonRepository;

class PantalonService
{
    protected PantalonRepository $repo;

    public function __construct(PantalonRepository $repo)
    {
        $this->repo = $repo;
    }

    public function create(array $data): Pantalon
    {
        return $this->repo->create($data);
    }

    public function getById($id): ?Pantalon
    {
        $id = (int) $id;
        return $this->repo->findById($id);
    }

    public function update($id, array $data): ?bool
    {
        $id = (int) $id;
        $profile = $this->repo->findById($id);
        if (!$profile) return null;

        return $this->repo->update($id, $data);
    }

    public function delete($id): bool
    {
        $id = (int) $id;
        $pantalon = $this->repo->findById($id);

        if ($pantalon) {
            return $this->repo->delete($id);
        }
        return false;
    }

    public function getAllPantalon(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repo->getAll();
    }
    public function getAllByUser(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repo->getAllByUser($userId);
    }
}
