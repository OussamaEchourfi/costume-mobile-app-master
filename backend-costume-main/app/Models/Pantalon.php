<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pantalon extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'profile_name',
        'tour_taille',
        'tour_hanches',
        'tour_cuisse',
        'tour_genou',
        'tour_cheville',
        'longueur_entrejambes',
        'longueur_totale',
        'coupe',
        'revers',
        'type_ceinture',
    ];

    protected $casts = [
        'tour_taille' => 'decimal:2',
        'tour_hanches' => 'decimal:2',
        'tour_cuisse' => 'decimal:2',
        'tour_genou' => 'decimal:2',
        'tour_cheville' => 'decimal:2',
        'longueur_entrejambes' => 'decimal:2',
        'longueur_totale' => 'decimal:2',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
