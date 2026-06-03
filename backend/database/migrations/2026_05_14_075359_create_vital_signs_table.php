<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vital_signs', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->integer('systolic_pressure');

            $table->integer('diastolic_pressure');

            $table->decimal('blood_sugar', 5, 2);

            $table->integer('heart_rate');

            $table->decimal('body_temperature', 4, 2);

            $table->decimal('weight', 5, 2);

            $table->datetime('recorded_at');

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vital_signs');
    }
};