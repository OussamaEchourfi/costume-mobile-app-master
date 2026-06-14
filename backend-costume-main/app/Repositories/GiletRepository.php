<?php
namespace App\Repositories;
use App\Models\Gilet;
use App\Repositories\Contracts\GiletRepositoryInterface;

class GiletRepository implements GiletRepositoryInterface
{
protected Gilet $model;

public function __construct(Gilet $model)
{
$this->model = $model;
}

public function getById($id)
{
return $this->model->find($id);
}
public function getAll(): \Illuminate\Database\Eloquent\Collection
{
    return $this->model->all();
}

    public function getByUserId($userId)
{
return $this->model->where('user_id', $userId)->get();
}

public function create(array $data)
{
return $this->model->create($data);
}

public function update($id, array $data)
{
$giletProfile = $this->model->find($id);

if ($giletProfile) {
$giletProfile->update($data);
return $giletProfile;
}

return null;
}

public function delete($id)
{
$giletProfile = $this->model->find($id);

if ($giletProfile) {
return $giletProfile->delete();
}

return false;
}
}
