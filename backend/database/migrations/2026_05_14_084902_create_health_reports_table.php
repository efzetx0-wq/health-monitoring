<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health_reports', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->date('report_period_start');

            $table->date('report_period_end');

            $table->decimal('average_sleep', 5, 2)
                ->default(0);

            $table->decimal('average_calories_burned', 8, 2)
                ->default(0);

            $table->integer('average_steps')
                ->default(0);

            $table->string('bmi_status');

            $table->text('health_insight');

            $table->datetime('generated_at');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_reports');
    }
};