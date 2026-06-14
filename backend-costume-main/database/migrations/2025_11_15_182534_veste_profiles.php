<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('veste_profiles', function (Blueprint $table) {
            $table->id();


            $table->unsignedBigInteger('user_id');
            $table->string('profile_name', 100)->default('Profil Principal');


            $table->decimal('tour_poitrine', 5, 2)->nullable();
            $table->decimal('tour_taille', 5, 2)->nullable();
            $table->decimal('tour_hanches', 5, 2)->nullable();
            $table->decimal('largeur_epaules', 5, 2)->nullable();
            $table->decimal('longueur_manche', 5, 2)->nullable();
            $table->decimal('longueur_veste', 5, 2)->nullable();
            $table->enum('type_revers', ['notch', 'peak', 'shawl'])->default('notch');
            $table->enum('boutons', ['1', '2', '3'])->default('2');
            $table->enum('poches', ['patch', 'flap', 'besom'])->default('flap');
            $table->enum('ventriere', ['aucune', 'centrale', 'cote'])->default('cote');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('veste_profiles');
    }
};
