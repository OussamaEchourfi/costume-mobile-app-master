<?php

namespace App\Http\Controllers;

use App\Services\PantalonService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PantalonController extends Controller
{
    protected PantalonService $service;

    public function __construct(PantalonService $service)
    {
        $this->service = $service;
    }

    public function getall(): JsonResponse
    {
        $pantalons = $this->service->getAllPantalon();
        return response()->json([
            'success' => true,
            'data' => $pantalons,
            'message' => 'Tous les pantalons récupérés'
        ]);
    }

    public function getAllByUser($userId): JsonResponse
    {
        $pantalons = $this->service->getAllByUser((int)$userId);
        return response()->json([
            'success' => true,
            'data' => $pantalons,
            'message' => 'Vos profils pantalon'
        ]);
    }

    public function create(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'profile_name' => 'required|string|max:100',
            'tour_taille' => 'nullable|numeric',
            'tour_hanches' => 'nullable|numeric',
            'tour_cuisse' => 'nullable|numeric',
            'tour_genou' => 'nullable|numeric',
            'tour_cheville' => 'nullable|numeric',
            'longueur_entrejambes' => 'nullable|numeric',
            'longueur_totale' => 'nullable|numeric',
            'coupe' => 'required|in:slim,regular,loose',
            'revers' => 'required|in:oui,non',
            'type_ceinture' => 'required|in:classique,elastique',
        ]);

        $pantalon = $this->service->create($data);
        return response()->json($pantalon, 201);
    }

    public function getById($id): JsonResponse
    {
        $pantalon = $this->service->getById($id);
        if (!$pantalon) {
            return response()->json(['message' => 'Pantalon non trouvé'], 404);
        }
        return response()->json($pantalon);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $result = $this->service->update($id, $request->all());
        return response()->json(['success' => $result]);
    }

    public function delete($id): JsonResponse
    {
        $result = $this->service->delete($id);
        return response()->json(['message' => $result ? 'Supprimé' : 'Non trouvé'], $result ? 200 : 404);
    }
}
