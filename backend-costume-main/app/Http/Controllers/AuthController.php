<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService)
    {
    }

    public function register(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->authService->register($request->all());

            return response()->json([
                'data' => $result,
                'message' => 'Compte créé avec succès'
            ], Response::HTTP_CREATED);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du compte: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function login(Request $request)
    {
        try {
            $result = $this->authService->login($request->all());

            return response()->json([
                'data' => $result,
                'message' => 'Connexion réussie'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la connexion: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function logout(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->authService->logout();

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message']
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function refresh(Request $request)
    {
        try {
            $result = $this->authService->refresh();

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Token rafraîchi avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function me(Request $request)
    {
        try {
            $user = $this->authService->getCurrentUser();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], Response::HTTP_UNAUTHORIZED);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user
                ],
                'message' => 'Profil utilisateur récupéré avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du profil: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function validateToken(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $token = $request->bearerToken();

            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token manquant'
                ], Response::HTTP_UNAUTHORIZED);
            }

            $result = $this->authService->validateToken($token);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Token valide'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $this->authService->getCurrentUser();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], Response::HTTP_UNAUTHORIZED);
            }

            $result = $this->authService->updateProfile($user, $request->all());

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Profil mis à jour avec succès'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du profil: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function changePassword(Request $request)
    {
        try {
            $user = $this->authService->getCurrentUser();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], Response::HTTP_UNAUTHORIZED);
            }

            $result = $this->authService->changePassword($user, $request->all());

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Mot de passe mis à jour avec succès'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du changement de mot de passe: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * CORRECTION : checkEmail - Déplacer la logique de validation dans le service
     */
    public function checkEmail(Request $request)
    {
        try {
            $result = $this->authService->checkEmail($request->all());

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Vérification email effectuée'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
