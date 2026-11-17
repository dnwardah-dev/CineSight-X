<?php

namespace App\Http\Controllers;

use App\Models\SeatAuditLog;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CinemaActivityExportController extends Controller
{
    public function __invoke(Request $request): StreamedResponse
    {
        $input = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'action' => [
                'nullable',
                Rule::in(['SEAT_STATUS_CHANGED', 'ACTIVATE_ALL']),
            ],
        ]);

        $search = trim($input['search'] ?? '');
        $action = $input['action'] ?? null;

        $query = SeatAuditLog::query()
            ->where('studio_id', 1)
            ->with(['user:id,name', 'seat:id,row_label,number']);

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
                    $builder->orWhereHas(
                        'seat',
                        fn ($seat) => $seat
                            ->where('row_label', strtoupper($matches[1]))
                            ->where('number', (int) $matches[2])
                    );
                }
            });
        }

        $filename = 'cinesight-audit-'
            .now('Asia/Jakarta')->format('Ymd-His')
            .'.csv';

        return response()->streamDownload(
            function () use ($query) {
                $out = fopen('php://output', 'w');

                if ($out === false) {
                    throw new \RuntimeException('CSV output unavailable.');
                }

                try {
                    fwrite($out, "\xEF\xBB\xBF");

                    fputcsv($out, [
                        'Log ID',
                        'Seat',
                        'Action',
                        'Administrator',
                        'Old Status',
                        'New Status',
                        'Affected Seats',
                        'Created At WIB',
                    ], ',', '"', '');

                    $status = static function ($value): string {
                        if ($value === null) {
                            return 'UNKNOWN';
                        }

                        return $value ? 'ACTIVE' : 'INACTIVE';
                    };

                    $safeText = static function (string $value): string {
                        $value = str_replace(
                            ["\r", "\n", "\t"],
                            ' ',
                            $value
                        );

                        if (preg_match('/^\s*[=+\-@]/u', $value)) {
                            return "'".$value;
                        }

                        return $value;
                    };

                    $query->chunkByIdDesc(
                        200,
                        function ($logs) use ($out, $status, $safeText) {
                            foreach ($logs as $log) {
                                $seat = $log->seat
                                    ? $log->seat->row_label
                                        .$log->seat->number
                                    : 'ALL';

                                fputcsv($out, [
                                    $log->id,
                                    $seat,
                                    $log->action,
                                    $safeText(
                                        $log->user?->name ?? 'Deleted user'
                                    ),
                                    $status($log->old_status),
                                    $status($log->new_status),
                                    $log->affected_seats,
                                    $log->created_at
                                        ? $log->created_at
                                            ->copy()
                                            ->timezone('Asia/Jakarta')
                                            ->format('Y-m-d H:i:s')
                                        : '',
                                ], ',', '"', '');
                            }
                        },
                        'id'
                    );
                } finally {
                    fclose($out);
                }
            },
            $filename,
            [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Cache-Control' => 'private, no-store',
            ]
        );
    }
}
