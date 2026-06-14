<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\JwtRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class JwtService
{
    public function __construct(
        private JwtRepositoryInterface $jwtRepository,
        private UserRepositoryInterface $userRepository
    ) {}


    public function generateToken(User $user): array
    {
        $token = JWTAuth::fromUser($user);

        return [
            'access_token' => $token,
        ];
    }


    public function refreshToken(): array
    {
        try {
            $newToken = JWTAuth::refresh();
            $user = JWTAuth::user();

            return [
                'access_token' => $newToken,
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user' => $user
            ];
        } catch (JWTException $e) {
            throw new \Exception('Impossible de rafraîchir le token');
        }
    }


    public function invalidateToken(): bool
    {
        try {
            JWTAuth::invalidate();
            return true;
        } catch (JWTException $e) {
            return false;
        }
    }


    public function getAuthenticatedUser(): ?User
    {
        try {
            return JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            return null;
        }
    }


    public function validateToken(string $token): bool
    {

        if (!$this->jwtRepository->validateTokenStructure($token)) {
            return false;
        }


        $payload = $this->jwtRepository->getTokenPayload($token);

        if (!$payload) {
            return false;
        }


        if ($this->jwtRepository->isTokenExpired($payload)) {
            return false;
        }


        $userId = $this->jwtRepository->getTokenSubject($payload);
        if (!$userId) {
            return false;
        }

        $user = $this->userRepository->findById($userId);
        return $user !== null;
    }


    public function getTokenPayload(string $token = null): ?array
    {
        try {
            if ($token) {
                return $this->jwtRepository->getTokenPayload($token);
            }

            return JWTAuth::getPayload()->toArray();
        } catch (JWTException $e) {
            return null;
        }
    }


    public function getUserFromToken(string $token): ?User
    {
        $payload = $this->jwtRepository->getTokenPayload($token);

        if (!$payload) {
            return null;
        }

        $userId = $this->jwtRepository->getTokenSubject($payload);

        if (!$userId) {
            return null;
        }

        return $this->userRepository->findById($userId);
    }
}
