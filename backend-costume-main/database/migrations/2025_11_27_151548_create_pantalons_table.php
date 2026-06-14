<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pantalons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->string('profile_name', 100)->default('Profil Principal');
            $table->decimal('tour_taille', 5, 2)->nullable();
            $table->decimal('tour_hanches', 5, 2)->nullable();
            $table->decimal('tour_cuisse', 5, 2)->nullable();
            $table->decimal('tour_genou', 5, 2)->nullable();
            $table->decimal('tour_cheville', 5, 2)->nullable();
            $table->decimal('longueur_entrejambes', 5, 2)->nullable();
            $table->decimal('longueur_totale', 5, 2)->nullable();
            $table->enum('coupe', ['slim', 'regular', 'loose'])->default('regular');
            $table->enum('revers', ['oui', 'non'])->default('non');
            $table->enum('type_ceinture', ['classique', 'elastique'])->default('classique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pantalons');
    }
};
