<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('costumes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('veste_profile_id')->constrained('veste_profiles')->onDelete('cascade');
            $table->foreignId('gilet_id')->nullable()->constrained('gilets')->onDelete('cascade');
            $table->foreignId('pantalon_id')->constrained('pantalons')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('costumes');
    }
};
