<?php

namespace App\Http\Controllers;

use App\Services\GiletService;
use Illuminate\Http\Request;

class GiletController extends Controller
{
    protected GiletService $service;

    public function __construct(GiletService $service)
    {
        $this->service = $service;
    }

    public function create(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|integer',
            'profile_name' => 'string',
            'tour_poitrine' => 'numeric|nullable',
            'tour_taille' => 'numeric|nullable',
            'largeur_epaules' => 'numeric|nullable',
            'longueur_gilet' => 'numeric|nullable',
            'boutons' => 'required|integer|in:5,6,7',
            'poches' => 'in:passepoil,classique,double',
        ]);

        return $this->service->create($data);
    }

    public function getById($id)
    {
        return $this->service->getById($id);
    }

    public function getByUser($userId)
    {
        return $this->service->getByUser($userId);
    }

    public function update(Request $request, $id)
    {
        return $this->service->update($id, $request->all());
    }

    public function delete($id): \Illuminate\Http\JsonResponse
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Profile deleted']);
    }

    public function getall(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->service->getAllGilet();
    }
}
