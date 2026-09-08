<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('contact_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->decimal('value', 12, 2);
            $table->string('currency', 3)->default('USD');
            $table->enum('stage', ['qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost']);
            $table->integer('probability')->default(0);
            $table->date('expected_close_date')->nullable();
            $table->date('actual_close_date')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['open', 'won', 'lost'])->default('open');
            $table->timestamps();

            $table->index(['user_id', 'stage']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
