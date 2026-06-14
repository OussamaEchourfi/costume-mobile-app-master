<?php

namespace App\Repositories;

use App\Repositories\Contracts\JwtRepositoryInterface;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class JwtRepository implements JwtRepositoryInterface
{
    public function getTokenPayload(string $token): ?array
    {
        try {
            return JWTAuth::setToken($token)->getPayload()->toArray();
        } catch (JWTException $e) {
            return null;
        }
    }

    public function validateTokenStructure(string $token): bool
    {
        $parts = explode('.', $token);
        return count($parts) === 3;
    }

    public function isTokenExpired(array $payload): bool
    {
        $exp = $payload['exp'] ?? null;

        if (!$exp) {
            return true;
        }

        return $exp < time();
    }

    public function getTokenExpiration(array $payload): ?int
    {
        return $payload['exp'] ?? null;
    }

    public function getTokenSubject(array $payload): ?int
    {
        return $payload['sub'] ?? null;
    }
}
