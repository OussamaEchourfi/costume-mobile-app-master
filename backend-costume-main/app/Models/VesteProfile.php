<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VesteProfile extends Model
{
use HasFactory;

protected $table = 'veste_profiles';
    public $timestamps = false;

protected $fillable = [
'user_id',
'profile_name',
'tour_poitrine',
'tour_taille',
'tour_hanches',
'largeur_epaules',
'longueur_manche',
'longueur_veste',
'type_revers',
'boutons',
'poches',
'ventriere',
];

public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
{
return $this->belongsTo(User::class);
}
}
