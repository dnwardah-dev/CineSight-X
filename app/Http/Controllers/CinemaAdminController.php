<?php

namespace App\Http\Controllers;

use App\Models\Seat;
use App\Models\SeatAuditLog;
use App\Models\Studio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CinemaAdminController extends Controller
{
    public function index(): Response
    {
        $studio = Studio::findOrFail(1);

        $seats = Seat::query()
            ->where('studio_id', $studio->id)
            ->orderBy('row_label')
            ->orderBy('number')
            ->get()
            ->map(fn (Seat $seat) => [
                'id' => $seat->row_label.$seat->number,
                'row' => $seat->row_label,
                'number' => $seat->number,
                'is_active' => (bool) $seat->is_active,
            ])
            ->values();

        // CINESIGHT_ACTIVITY_HISTORY_V2
        $auditLogs = SeatAuditLog::query()
            ->with([
                'user:id,name',
                'seat:id,row_label,number',
            ])
            ->where('studio_id', $studio->id)
            ->orderByDesc('id')
            ->limit(20)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'admin_name' => $log->user?->name ?? 'Deleted user',
                'seat_label' => $log->seat
                    ? $log->seat->row_label.$log->seat->number
                    : null,
                'old_status' => $log->old_status,
                'new_status' => $log->new_status,
                'affected_seats' => $log->affected_seats,
                'created_at' => $log->created_at?->toISOString(),
            ]);

        return Inertia::render('cinema-admin', [
            'auditLogs' => $auditLogs,
            'studio' => [
                'id' => $studio->id,
                'name' => $studio->name,
                'rows' => $studio->rows,
            ],
            'seats' => $seats,
            'summary' => [
                'total' => $seats->count(),
                'active' => $seats->where('is_active', true)->count(),
                'inactive' => $seats->where('is_active', false)->count(),
            ],
        ]);
    }

    public function update(
        Request $request,
        string $seat
    ): RedirectResponse {
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $seatId = strtoupper($seat);

        if (! preg_match(
            '/^([A-J])(1[0-8]|[1-9])$/',
            $seatId,
            $matches
        )) {
            abort(404);
        }

        $record = Seat::query()
            ->where('studio_id', 1)
            ->where('row_label', $matches[1])
            ->where('number', (int) $matches[2])
            ->firstOrFail();

        // CINESIGHT_AUDIT_LOG_V1
        DB::transaction(function () use (
            $request,
            $record,
            $validated
        ) {
            $oldStatus = (bool) $record->is_active;
            $newStatus = (bool) $validated['is_active'];

            if ($oldStatus === $newStatus) {
                return;
            }

            $record->is_active = $newStatus;
            $record->save();

            SeatAuditLog::create([
                'studio_id' => $record->studio_id,
                'user_id' => $request->user()->id,
                'seat_id' => $record->id,
                'action' => 'SEAT_STATUS_CHANGED',
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'affected_seats' => 1,
            ]);
        });

        return redirect()
            ->route('cinema.admin')
            ->with('success', "Seat {$seatId} updated.");
    }

    // CINESIGHT_BULK_ACTIVATE_V1
    public function activateAll(
        Request $request
    ): RedirectResponse {
        $request->validate([
            'confirmation' => [
                'required',
                'in:ACTIVATE_ALL',
            ],
        ]);

        Studio::findOrFail(1);

        DB::transaction(function () use ($request) {
            $affected = Seat::query()
                ->where('studio_id', 1)
                ->where('is_active', false)
                ->update(['is_active' => true]);

            if ($affected > 0) {
                SeatAuditLog::create([
                    'studio_id' => 1,
                    'user_id' => $request->user()->id,
                    'seat_id' => null,
                    'action' => 'ACTIVATE_ALL',
                    'old_status' => false,
                    'new_status' => true,
                    'affected_seats' => $affected,
                ]);
            }
        });

        return redirect()
            ->route('cinema.admin')
            ->with('success', 'All seats activated.');
    }
}
