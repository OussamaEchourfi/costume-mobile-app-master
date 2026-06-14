<?php

namespace App\Repositories;

use App\Models\VesteProfile;
use App\Repositories\Contracts\VesteProfileRepositoryInterface;

class VesteProfileRepository implements VesteProfileRepositoryInterface
{
    public function getById($id)
    {
        return VesteProfile::find($id);
    }

    public function getByUserId($userId)
    {
        return VesteProfile::where('user_id', $userId)->get();
    }

    public function create(array $data)
    {
        return VesteProfile::create($data);
    }

    public function update($id, array $data)
    {
        $profile = VesteProfile::find($id);
        if (!$profile) {
            return null;
        }

        $profile->update($data);
        return $profile;
    }
    public function getall(): \Illuminate\Database\Eloquent\Collection
    {
        return VesteProfile::all();
    }



    public function delete($id)
    {
        $profile = VesteProfile::find($id);
        if (!$profile) {
            return false;
        }

        return $profile->delete();
    }
}
