<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('foods', function (Blueprint $table) {

            $table->id();

            $table->string('food_name');

            $table->integer('calories');

            $table->decimal('protein', 5, 2)->default(0);

            $table->decimal('carbohydrates', 5, 2)->default(0);

            $table->decimal('fat', 5, 2)->default(0);

            $table->string('serving_size')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};