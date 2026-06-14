<?php

namespace App\Services;

use App\Models\Gilet;
use App\Repositories\GiletRepository;

class GiletService
{
    protected GiletRepository $repo;

    public function __construct(GiletRepository $repo)
    {
        $this->repo = $repo;
    }

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

    public function getById($id)
    {
        return $this->repo->getById($id);
    }

    public function getByUser($userId)
    {
        return $this->repo->getByUserId($userId);
    }

    public function update($id, array $data)
    {
        $profile = $this->repo->getById($id);
        if (!$profile) return null;

        return $this->repo->update($id, $data);
    }

    public function delete($id)
    {
        $profile = $this->repo->getById($id);
        if ($profile) {
            return $this->repo->delete($id);
        }
        return false;
    }

    public function getAllGilet(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repo->getAll();
    }
}
