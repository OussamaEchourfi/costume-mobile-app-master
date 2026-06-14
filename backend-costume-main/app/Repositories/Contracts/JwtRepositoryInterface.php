<?php

namespace App\Repositories\Contracts;

use App\Models\User;

interface JwtRepositoryInterface
{
    public function getTokenPayload(string $token): ?array;
    public function validateTokenStructure(string $token): bool;
    public function isTokenExpired(array $payload): bool;
    public function getTokenExpiration(array $payload): ?int;
}
