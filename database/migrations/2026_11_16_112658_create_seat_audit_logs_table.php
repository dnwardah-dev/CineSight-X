<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seat_audit_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('studio_id')
                ->constrained('studios')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('seat_id')
                ->nullable()
                ->constrained('seats')
                ->nullOnDelete();

            $table->string('action', 40);

            $table->boolean('old_status')->nullable();
            $table->boolean('new_status')->nullable();

            $table->unsignedInteger('affected_seats')
                ->default(1);

            $table->timestamps();

            $table->index(['studio_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seat_audit_logs');
    }
};
