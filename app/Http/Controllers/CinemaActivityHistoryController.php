<?php

namespace App\Http\Controllers;

use App\Models\SeatAuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CinemaActivityHistoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'action' => [
                'nullable',
                Rule::in([
                    'SEAT_STATUS_CHANGED',
                    'ACTIVATE_ALL',
                ]),
            ],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $search = trim($validated['search'] ?? '');
        $action = $validated['action'] ?? null;

        $query = SeatAuditLog::query()
            ->where('studio_id', 1)
            ->with([
                'user:id,name',
                'seat:id,row_label,number',
            ]);

        if ($action !== null) {
            $query->where('action', $action);
        }

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder->whereHas(
                    'user',
                    fn ($user) => $user->where(
                        'name',
                        'like',
                        '%'.$search.'%'
                    )
                );

                if (preg_match(
                    '/^([A-J])\s*(1[0-8]|[1-9])$/i',
                    $search,
                    $matches
                )) {
                    $row = strtoupper($matches[1]);
                    $number = (int) $matches[2];

                    $builder->orWhereHas(
                        'seat',
                        fn ($seat) => $seat
                            ->where('row_label', $row)
                            ->where('number', $number)
                    );
                }
            });
        }

        $logs = $query
            ->orderByDesc('id')
            ->paginate(10)
            ->through(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'admin_name' => $log->user?->name
                    ?? 'Deleted user',
                'seat_label' => $log->seat
                    ? $log->seat->row_label
                        .$log->seat->number
                    : null,
                'old_status' => $log->old_status,
                'new_status' => $log->new_status,
                'affected_seats' => $log->affected_seats,
                'created_at' => $log->created_at?->toISOString(),
            ]);

        return response()->json([
            'data' => $logs->items(),
            'current_page' => $logs->currentPage(),
            'last_page' => $logs->lastPage(),
            'per_page' => $logs->perPage(),
            'total' => $logs->total(),
        ]);
    }
}
