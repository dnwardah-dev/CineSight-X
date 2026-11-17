<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeatAuditLog extends Model
{
    protected $fillable = [
        'studio_id',
        'user_id',
        'seat_id',
        'action',
        'old_status',
        'new_status',
        'affected_seats',
    ];

    protected function casts(): array
    {
        return [
            'old_status' => 'boolean',
            'new_status' => 'boolean',
            'affected_seats' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }

    public function studio(): BelongsTo
    {
        return $this->belongsTo(Studio::class);
    }
}
