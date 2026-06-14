<?php

namespace App\Services;

use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}
    public function getAllUsers(array $filters = []): LengthAwarePaginator
    {
        return $this->userRepository->getAllPaginated($filters);
    }


    public function findUser(int $userId): ?array
    {
        $user = $this->userRepository->findById($userId);

        if (!$user) {
            return null;
        }

        return [
            'user' => $user
        ];
    }


    public function updateUser(int $userId, array $data): array
    {
        $user = $this->userRepository->findById($userId);

        if (!$user) {
            throw new \Exception('Utilisateur non trouvé');
        }

        $this->userRepository->update($user, $data);

        return [
            'user' => $user->fresh()
        ];
    }


    public function deleteUser(int $userId): bool
    {
        $user = $this->userRepository->findById($userId);

        if (!$user) {
            throw new \Exception('Utilisateur non trouvé');
        }

        return $this->userRepository->delete($user);
    }

}
