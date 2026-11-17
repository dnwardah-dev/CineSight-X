<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('studios', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->json('rows');
            $table->unsignedInteger('seats_per_row');
            $table->json('screen');
            $table->json('geometry');
            $table->timestamps();
        });

        Schema::create('seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('studio_id')
                ->constrained('studios')
                ->cascadeOnDelete();
            $table->string('row_label', 2);
            $table->unsignedInteger('number');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique([
                'studio_id',
                'row_label',
                'number',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seats');
        Schema::dropIfExists('studios');
    }
};
