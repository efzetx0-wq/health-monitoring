<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('health_profiles', function (
            Blueprint $table
        ) {

            $table->id();

            // RELATION TO USERS
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            // BASIC PROFILE
            $table->integer('age');

            $table->enum('gender', [
                'male',
                'female'
            ]);

            // HEIGHT CM
            $table->decimal(
                'height',
                6,
                2
            );

            // WEIGHT KG
            $table->decimal(
                'weight',
                6,
                2
            );

            // BMI AUTO
            $table->decimal(
                'bmi',
                5,
                2
            )->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(
            'health_profiles'
        );
    }
};