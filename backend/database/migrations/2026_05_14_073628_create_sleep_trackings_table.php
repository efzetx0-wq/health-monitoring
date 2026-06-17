<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sleep_trackings', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->date('sleep_date'); 

            $table->time('sleep_time'); 
            $table->time('wake_time');  

            $table->decimal('sleep_duration', 5, 2);

            $table->enum('sleep_quality', [
                'poor',
                'fair',
                'good',
                'excellent'
            ]);

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sleep_trackings');
    }
};