<?php

namespace App\Repositories\Contracts;

interface GiletRepositoryInterface
{
    public function getById($id);

    public function getByUserId($userId);
    public function getAll();

    public function create(array $data);

    public function update($id, array $data);

    public function delete($id);

}
