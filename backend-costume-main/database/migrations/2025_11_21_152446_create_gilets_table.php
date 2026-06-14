<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gilets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->string('profile_name', 100)->default('Profil Gilet');
            $table->decimal('tour_poitrine', 5, 2)->nullable();
            $table->decimal('tour_taille', 5, 2)->nullable();
            $table->decimal('largeur_epaules', 5, 2)->nullable();
            $table->decimal('longueur_gilet', 5, 2)->nullable();
            $table->enum('boutons', ['4', '5', '6'])->default('5');
            $table->enum('poches', ['classique', 'passepoil', 'double'])->default('classique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gilets');
    }
};
