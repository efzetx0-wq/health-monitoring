<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_targets', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
                
            $table->integer('step_target');
            $table->integer('calorie_target');
            $table->decimal('sleep_target', 4, 2); 
            $table->date('target_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_targets');
    }
};