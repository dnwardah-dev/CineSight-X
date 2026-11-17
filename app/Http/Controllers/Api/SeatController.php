<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seat;
use App\Models\Studio;
use Illuminate\Http\JsonResponse;

class SeatController extends Controller
{
    public function index(int $studio): JsonResponse
    {
        $record = Studio::findOrFail($studio);

        $seats = Seat::query()
            ->where('studio_id', $record->id)
            ->orderBy('row_label')
            ->orderBy('number')
            ->get()
            ->map(fn (Seat $item) => [
                'id' => $item->id,
                'seat_id' => $item->row_label.$item->number,
                'row' => $item->row_label,
                'number' => $item->number,
                'is_active' => (bool) $item->is_active,
            ])
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'studio_id' => $record->id,
                'total_seats' => $seats->count(),
                'active_seats' => $seats
                    ->where('is_active', true)
                    ->count(),
                'seats' => $seats,
            ],
        ]);
    }

    public function show(int $studio, string $seat): JsonResponse
    {
        $record = Studio::findOrFail($studio);

        $seatId = strtoupper($seat);

        if (! preg_match('/^([A-J])(1[0-8]|[1-9])$/', $seatId, $matches)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid seat identifier.',
            ], 404);
        }

        $item = Seat::query()
            ->where('studio_id', $record->id)
            ->where('row_label', $matches[1])
            ->where('number', (int) $matches[2])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $item->id,
                'studio_id' => $record->id,
                'seat_id' => $item->row_label.$item->number,
                'row' => $item->row_label,
                'number' => $item->number,
                'is_active' => (bool) $item->is_active,
                'status' => $item->is_active
                    ? 'ACTIVE'
                    : 'INACTIVE',
            ],
        ]);
    }
}
