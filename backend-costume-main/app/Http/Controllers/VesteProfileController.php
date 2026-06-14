<?php
namespace App\Http\Controllers;

use App\Services\VesteProfileService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VesteProfileController extends Controller
{
    protected $service;

    public function __construct(VesteProfileService $service)
    {
        $this->service = $service;
    }

    public function create(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => 'required|integer',
            'profile_name' => 'string',
            'tour_poitrine' => 'numeric|nullable',
            'tour_taille' => 'numeric|nullable',
            'tour_hanches' => 'numeric|nullable',
            'largeur_epaules' => 'numeric|nullable',
            'longueur_manche' => 'numeric|nullable',
            'longueur_veste' => 'numeric|nullable',
            'type_revers' => 'in:notch,peak,shawl',
            'boutons' => 'in:1,2,3',
            'poches' => 'in:patch,flap,besom',
            'ventriere' => 'in:aucune,centrale,cote',
        ]);

        $profile = $this->service->create($data);
        return response()->json($profile, 201);
    }

    public function getById($id): JsonResponse
    {
        $profile = $this->service->getById($id);

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile);
    }

    public function getByUser($userId): JsonResponse
    {
        $profiles = $this->service->getByUser($userId);
        return response()->json($profiles);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $data = $request->validate([
            'profile_name' => 'string',
            'tour_poitrine' => 'numeric|nullable',
            'tour_taille' => 'numeric|nullable',
            'tour_hanches' => 'numeric|nullable',
            'largeur_epaules' => 'numeric|nullable',
            'longueur_manche' => 'numeric|nullable',
            'longueur_veste' => 'numeric|nullable',
            'type_revers' => 'in:notch,peak,shawl',
            'boutons' => 'in:1,2,3',
            'poches' => 'in:patch,flap,besom',
            'ventriere' => 'in:aucune,centrale,cote',
        ]);

        $profile = $this->service->update($id, $data);

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile);
    }

    public function delete($id): JsonResponse
    {
        $deleted = $this->service->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json(['message' => 'Profile deleted successfully']);
    }

    public function getAll(): JsonResponse
    {
        $profiles = $this->service->getAllVesteProfiles();
        return response()->json([
            'success' => true,
            'data' => $profiles,
            'message' => 'Profils récupérés avec succès'
        ]);
    }
}
