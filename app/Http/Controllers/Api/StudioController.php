<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Studio;
use Illuminate\Http\JsonResponse;

class StudioController extends Controller
{
    public function show(int $studio): JsonResponse
    {
        $record = Studio::query()
            ->withCount([
                'seats',
                'seats as active_seats_count' => function ($query) {
                    $query->where('is_active', true);
                },
            ])
            ->findOrFail($studio);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $record->id,
                'name' => $record->name,
                'type' => $record->type,

                'rows' => $record->rows,
                'seats_per_row' => $record->seats_per_row,

                'total_seats' => $record->seats_count,
                'active_seats' => $record->active_seats_count,

                'screen' => $record->screen,
                'geometry' => $record->geometry,

                'source' => 'database',
            ],
        ]);
    }
}
