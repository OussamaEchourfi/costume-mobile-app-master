<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    public $timestamps = false;


    public const ROLE_CLIENT = 'Client';
    public const ROLE_ADMIN = 'Admin';

    protected $fillable = [
        'firstName',
        'lastName',
        'email',
        'password',
        'phone',
        'role',
    ];

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }


    public function isClient(): bool
    {
        return $this->role === self::ROLE_CLIENT;
    }


    public function vesteProfiles() { return $this->hasMany(\App\Models\VesteProfile::class, 'user_id'); }
    public function Gilet() { return $this->hasMany(\App\Models\Gilet::class, 'user_id'); }
    public function Pantalon() { return $this->hasMany(\App\Models\Pantalon::class, 'user_id'); }
    public function Costume() { return $this->hasMany(\App\Models\Costume::class, 'user_id'); }

    // --- JWT Methods ---
    public function getJWTIdentifier() { return $this->getKey(); }

    public function getJWTCustomClaims(): array
    {
        return [
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'email' => $this->email,
            'role' => $this->role,
        ];
    }
}
