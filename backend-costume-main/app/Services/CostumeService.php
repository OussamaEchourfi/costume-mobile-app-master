<?php

namespace App\Services;

use App\Repositories\Contracts\CostumeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Exception;

class CostumeService
{
    public function __construct(
        private CostumeRepositoryInterface $costumeRepository
    ) {}

    public function getAllCostumes(): Collection
    {
        return $this->costumeRepository->getAll();
    }

    public function findCostume(int $id): ?array
    {
        $costume = $this->costumeRepository->getById($id);

        if (!$costume) {
            return null;
        }

        return [
            'costume' => $costume
        ];
    }
    public function getCostumesByUser(int $userId): Collection
    {
        return $this->costumeRepository->getByUserId($userId);
    }

    public function createCostume(array $data)
    {
        return $this->costumeRepository->create($data);
    }
    public function updateCostume(int $id, array $data): array
    {
        $costume = $this->costumeRepository->update($id, $data);

        if (!$costume) {
            throw new Exception('Costume non trouvé');
        }

        return [
            'costume' => $costume
        ];
    }
    public function deleteCostume(int $id): bool
    {
        $deleted = $this->costumeRepository->delete($id);

        if (!$deleted) {
            throw new Exception('Impossible de supprimer : Costume non trouvé');
        }

        return $deleted;
    }
}
