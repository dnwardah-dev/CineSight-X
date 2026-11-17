<?php

namespace App\Http\Controllers;

use App\Models\SeatAuditLog;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CinemaActivityPdfController extends Controller
{
    public function __invoke(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'action' => [
                'nullable',
                Rule::in(['SEAT_STATUS_CHANGED', 'ACTIVATE_ALL']),
            ],
        ]);

        $search = trim($filters['search'] ?? '');
        $action = $filters['action'] ?? null;

        $query = SeatAuditLog::query()
            ->where('studio_id', 1)
            ->with(['user:id,name', 'seat:id,row_label,number']);

        if ($action) {
            $query->where('action', $action);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($user) use ($search) {
                    $user->where('name', 'like', '%'.$search.'%');
                });

                if (preg_match('/^([A-J])\s*(1[0-8]|[1-9])$/i', $search, $match)) {
                    $q->orWhereHas('seat', function ($seat) use ($match) {
                        $seat->where('row_label', strtoupper($match[1]))
                            ->where('number', (int) $match[2]);
                    });
                }
            });
        }

        $logs = $query->orderByDesc('id')->limit(500)->get();
        $generatedAt = now('Asia/Jakarta');

        return Pdf::loadView('pdf.cinesight-activity', [
            'logs' => $logs,
            'search' => $search,
            'action' => $action,
            'generatedAt' => $generatedAt,
        ])
            ->setPaper('a4', 'landscape')
            ->download('cinesight-activity-'.$generatedAt->format('Ymd-His').'.pdf');
    }
}
