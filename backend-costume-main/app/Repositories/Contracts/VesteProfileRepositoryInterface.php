<?php
namespace App\Repositories\Contracts;
interface VesteProfileRepositoryInterface
{
    public function getById($id);

    public function getByUserId($userId);

    public function create(array $data);

    public function update($id, array $data);

    public function delete($id);
}
