<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Studio extends Model
{
    protected $fillable = [
        'name',
        'type',
        'rows',
        'seats_per_row',
        'screen',
        'geometry',
    ];

    protected function casts(): array
    {
        return [
            'rows' => 'array',
            'screen' => 'array',
            'geometry' => 'array',
        ];
    }

    public function seats(): HasMany
    {
        return $this->hasMany(Seat::class);
    }
}
