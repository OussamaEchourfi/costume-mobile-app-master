<?php

namespace App\Http\Controllers;

use App\Services\CostumeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CostumeController extends Controller
{
    protected CostumeService $service;

    public function __construct(CostumeService $service)
    {
        $this->service = $service;
    }

    public function create(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'required|integer|exists:users,id',
            'veste_profile_id' => 'required|integer|exists:veste_profiles,id',
            'pantalon_id' => 'required|integer|exists:pantalons,id',
            'gilet_id' => 'nullable|integer|exists:gilets,id',
        ]);

        return response()->json($this->service->createCostume($data), 201);
    }

    public function getById($id): JsonResponse
    {
        $result = $this->service->findCostume($id);

        if (!$result) {
            return response()->json(['message' => 'Costume non trouvé'], 404);
        }

        return response()->json($result);
    }

    public function getByUser($userId): JsonResponse
    {
        return response()->json($this->service->getCostumesByUser($userId));
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $result = $this->service->updateCostume($id, $request->all());
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function delete($id): JsonResponse
    {
        try {
            $this->service->deleteCostume($id);
            return response()->json(['message' => 'Costume supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function getall(): JsonResponse
    {
        return response()->json($this->service->getAllCostumes());
    }
}
