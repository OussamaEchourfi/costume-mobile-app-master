<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Costume extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'name',
        'user_id',
        'veste_profile_id',
        'gilet_id',
        'pantalon_id',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function veste(): BelongsTo
    {
        return $this->belongsTo(VesteProfile::class, 'veste_profile_id');
    }
    public function gilet(): BelongsTo
    {
        return $this->belongsTo(Gilet::class, 'gilet_id');
    }
    public function pantalon(): BelongsTo
    {
        return $this->belongsTo(Pantalon::class, 'pantalon_id');
    }
}
