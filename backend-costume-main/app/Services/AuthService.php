<?php

namespace App\Services;

use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private JwtService $jwtService
    ) {}



    public function register(array $data): array
    {
        $validator = Validator::make($data, [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string',
            'phone' => 'nullable|string|max:20',
        ], [
            'email.unique' => 'Cet email est déjà utilisé.',
            'email.required' => 'L\'email est obligatoire.',
            'firstName.required' => 'Le nom est obligatoire.',
            'lastName.required' => 'Le prénom est obligatoire.',
            'password.required' => 'Le mot de passe est obligatoire.',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $user = $this->userRepository->create([
            'firstName' => $data['firstName'],
            'lastName' => $data['lastName'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'role' => 'Client',
        ]);



        return $this->jwtService->generateToken($user);

    }
    public function logout(): array
    {
        return [
            'success' => true,
            'message' => 'Déconnexion réussie'
        ];
    }

    public function login(array $data): array
    {
        $validator = Validator::make($data, [
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email doit être une adresse valide.',
            'password.required' => 'Le mot de passe est obligatoire.',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $user = $this->userRepository->findByEmail($data['email']);

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        return $this->jwtService->generateToken($user);
    }

    /**
     * Validates a token and returns the status along with user details.
     * * @param string $token
     * @return array
     * @throws \Exception
     */
    public function validateToken(string $token): array
    {
        // 1. Use your JwtService to check if the token is valid and get the user
        // Your JwtService already handles the repository checks and expiration logic
        $user = $this->jwtService->getUserFromToken($token);

        if (!$user) {
            throw new \Exception('Token invalide, expiré ou utilisateur introuvable.');
        }

        // 2. Return a structured response for the Controller
        return [
            'valid' => true,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'firstName' => $user->firstName,
                'lastName' => $user->lastName,
                'role' => $user->role,
            ]
        ];
    }

}
