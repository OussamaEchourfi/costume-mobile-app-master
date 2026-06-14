<?php

namespace App\Repositories\Contracts;

interface CostumeRepositoryInterface
{
    public function getAll();

    public function getById($id);

    public function getByUserId($userId);

    public function create(array $data);

    public function update($id, array $data);

    public function delete($id);
}
