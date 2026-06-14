<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UserController extends Controller
{
    public function __construct(private UserService $userService) {}

    /**
     * NOUVEAU : Récupère l'utilisateur connecté (Requis pour votre erreur actuelle)
     */
    public function getCurrentUser(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $user = $request->user();

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Profil récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liste tous les utilisateurs
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $users = $this->userService->getAllUsers($request->all());
            return response()->json([
                'success' => true,
                'data' => $users,
                'message' => 'Utilisateurs récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Recherche d'utilisateurs
     */
    public function search(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $users = $this->userService->getAllUsers([
                'search' => $request->query('query'),
                'per_page' => $request->query('per_page', 10)
            ]);

            return response()->json([
                'success' => true,
                'data' => $users,
                'message' => 'Résultats de recherche'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Mise à jour d'un utilisateur
     */
    public function update(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'firstName' => 'sometimes|string|max:255',
                'lastName' => 'sometimes|string|max:255',
                'phone' => 'sometimes|nullable|string|max:20',
                'role' => 'sometimes|in:Client,Admin',
                'email'     => 'sometimes|email|unique:users,email,' . $id,
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $result = $this->userService->updateUser($id, $validator->validated());
            return response()->json(['success' => true, 'data' => $result]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Suppression d'un utilisateur
     */
    public function destroy(int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $this->userService->deleteUser($id);
            return response()->json(['success' => true, 'message' => 'Utilisateur supprimé avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
