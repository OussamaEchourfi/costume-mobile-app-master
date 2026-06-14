<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gilet extends Model
{
    use HasFactory;

    protected $table = 'gilets';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'profile_name',
        'tour_poitrine',
        'tour_taille',
        'longueur_gilet',
        'largeur_epaules',
        'boutons',
        'poches',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
