<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }

    public function getAllPaginated(array $filters = []): LengthAwarePaginator
    {
        $query = User::query();

        // On ne cherche que les clients pour la gestion client
        $query->where('role', 'Client');

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('firstName', 'like', "%{$filters['search']}%")
                    ->orWhere('lastName', 'like', "%{$filters['search']}%")
                    ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }

        // Correction : tri sur 'id' car 'created_at' n'existe pas
        $sortBy = $filters['sort_by'] ?? 'id';
        $sortOrder = $filters['sort_order'] ?? 'desc';

        return $query->orderBy($sortBy, $sortOrder)
            ->paginate($filters['per_page'] ?? 15);
    }
}
