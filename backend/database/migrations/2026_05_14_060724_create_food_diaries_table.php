<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('food_diaries', function (Blueprint $table) {
            $table->id();

            // Tetap mengikat ke ID User yang sedang login
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            // MENGUBAH JADI TEKS BEBAS (Sesuai keinginan Anda)
            $table->string('food_name');       // Menyimpan ketikan nama makanan bebas (e.g., "Nasi Goreng Gila")
            $table->string('portion');         // Menyimpan ketikan porsi bebas (e.g., "1 piring penuh", "5 tusuk")
            
            // HASIL DARI AI GROQ
            $table->integer('calories');       // Menggunakan integer karena AI mengembalikan angka bulat kalori (e.g., 350)
            $table->text('ai_recommendation'); // Kolom baru untuk menampung saran kesehatan singkat dari Groq AI

            // DETAIL TAMBAHAN (Sesuai bawaan kode lama Anda)
            $table->datetime('consumed_at');   // Waktu makan
            $table->text('notes')->nullable(); // Catatan tambahan dari user

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('food_diaries');
    }
};