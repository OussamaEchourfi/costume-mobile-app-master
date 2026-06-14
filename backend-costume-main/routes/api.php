<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GiletController;
use App\Http\Controllers\PantalonController;
use App\Http\Controllers\VesteProfileController;
use App\Http\Controllers\CostumeController;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;

// --- Routes Publiques ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::post('/validate-token', [AuthController::class, 'validateToken']);
Route::post('/check-email', [AuthController::class, 'checkEmail']);

// --- Gestion des Éléments du Costume (Public ou Privé selon vos besoins) ---
Route::prefix('veste-profiles')->group(function () {
    Route::post('/', [VesteProfileController::class, 'create']);
    Route::get('/', [VesteProfileController::class, 'getAll']);
    Route::get('/{id}', [VesteProfileController::class, 'getById']);
    Route::get('/user/{userId}', [VesteProfileController::class, 'getByUser']);
    Route::put('/{id}', [VesteProfileController::class, 'update']);
    Route::delete('/{id}', [VesteProfileController::class, 'delete']);
});

Route::prefix('gilets')->group(function () {
    Route::post('/', [GiletController::class, 'create']);
    Route::get('/', [GiletController::class, 'getall']);
    Route::get('/{id}', [GiletController::class, 'getById']);
    Route::get('/user/{userId}', [GiletController::class, 'getByUser']);
    Route::put('/{id}', [GiletController::class, 'update']);
    Route::delete('/{id}', [GiletController::class, 'delete']);
});

Route::prefix('pantalons')->group(function () {
    Route::post('/', [PantalonController::class, 'create']);
    Route::get('/', [PantalonController::class, 'getall']);
    Route::get('/{id}', [PantalonController::class, 'getById']);
    Route::get('/user/{userId}', [PantalonController::class, 'getAllByUser']);
    Route::put('/{id}', [PantalonController::class, 'update']);
    Route::delete('/{id}', [PantalonController::class, 'delete']);
});

Route::prefix('costumes')->group(function () {
    Route::post('/', [CostumeController::class, 'create']);
    Route::get('/', [CostumeController::class, 'getall']);
    Route::get('/{id}', [CostumeController::class, 'getById']);
    Route::get('/user/{userId}', [CostumeController::class, 'getByUser']);
    Route::put('/{id}', [CostumeController::class, 'update']);
    Route::delete('/{id}', [CostumeController::class, 'delete']);
});

// --- Routes Protégées par JWT ---
Route::middleware([JwtMiddleware::class])->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    // Utilisateurs (Admin & Profil)
    // NOTE : On place /current et /search AVANT apiResource pour éviter les conflits d'ID
    Route::get('/users/current', [UserController::class, 'getCurrentUser']);
    Route::get('/users/search', [UserController::class, 'search']);

    // Fournit : GET /users, GET /users/{id}, PUT /users/{id}, DELETE /users/{id}
    Route::apiResource('users', UserController::class)->except(['store']);
});


Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'API is running',
        'timestamp' => now()
    ]);
});
