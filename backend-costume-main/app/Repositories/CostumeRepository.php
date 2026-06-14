<?php

namespace App\Repositories;

use App\Models\Costume;
use App\Repositories\Contracts\CostumeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CostumeRepository implements CostumeRepositoryInterface
{
    public function getAll(): Collection
    {
        return Costume::with(['veste', 'pantalon', 'gilet'])->get();
    }
    public function getById($id)
    {
        return Costume::with(['veste', 'pantalon', 'gilet'])->find($id);
    }
    public function getByUserId($userId)
    {
        return Costume::where('user_id', $userId)
            ->with(['veste', 'pantalon', 'gilet'])
            ->get();
    }
    public function create(array $data)
    {
        return Costume::create($data);
    }

    public function update($id, array $data)
    {
        $costume = Costume::find($id);
        if (!$costume) {
            return null;
        }

        $costume->update($data);
        return $costume->load(['veste', 'pantalon', 'gilet']);
    }
    public function delete($id): bool
    {
        $costume = Costume::find($id);
        if (!$costume) {
            return false;
        }

        return $costume->delete();
    }
}
