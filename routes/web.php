<?php

use App\Http\Controllers\Api\SeatController;
use App\Http\Controllers\Api\StudioController;
use App\Http\Controllers\CinemaActivityExportController;
use App\Http\Controllers\CinemaActivityHistoryController;
use App\Http\Controllers\CinemaActivityPdfController;
use App\Http\Controllers\CinemaAdminController;
use App\Http\Middleware\EnsureCineSightAdmin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

Route::get('/cinema', function () {
    return Inertia::render('cinema-simulator');
});

// CINESIGHT_STUDIO_API_V1
\Route::get('/api/v1/studios/{studio}', [
    StudioController::class,
    'show',
])->whereNumber('studio');

// CINESIGHT_SEAT_INDEX_V1
\Route::get('/api/v1/studios/{studio}/seats', [
    SeatController::class,
    'index',
])->whereNumber('studio');

// CINESIGHT_SEAT_DETAIL_V1
\Route::get('/api/v1/studios/{studio}/seats/{seat}', [
    SeatController::class,
    'show',
])->whereNumber('studio');

// CINESIGHT_ADMIN_DASHBOARD_V1
Route::middleware([
    'auth',
    EnsureCineSightAdmin::class,
])->group(function () {
    Route::get(
        '/cinema/admin',
        [CinemaAdminController::class, 'index']
    )->name('cinema.admin');

    Route::patch(
        '/cinema/admin/seats/{seat}',
        [CinemaAdminController::class, 'update']
    )->name('cinema.admin.seats.update');
});

// CINESIGHT_BULK_ACTIVATE_V1
Route::middleware([
    'auth',
    EnsureCineSightAdmin::class,
])->post(
    '/cinema/admin/seats/activate-all',
    [CinemaAdminController::class, 'activateAll']
)->name('cinema.admin.seats.activate-all');

// CINESIGHT_ACTIVITY_PAGINATION_V1
Route::middleware([
    'auth',
    EnsureCineSightAdmin::class,
])->get(
    '/cinema/admin/activity-history',
    [CinemaActivityHistoryController::class, 'index']
)->name('cinema.admin.activity-history');

// CINESIGHT_CSV_EXPORT_FIX_V2
Route::middleware([
    'auth',
    EnsureCineSightAdmin::class,
])->get(
    '/cinema/admin/activity-history/export',
    CinemaActivityExportController::class
)->name('cinema.admin.activity-export');

// CINESIGHT_PDF_EXPORT_V1
Route::middleware([
    'auth',
    EnsureCineSightAdmin::class,
])->get(
    '/cinema/admin/activity-history/export-pdf',
    CinemaActivityPdfController::class
)->name('cinema.admin.activity-export-pdf');

// CINESIGHT_EXPERIENCE_PAGE_V1
Route::get(
    '/cinema/experience',
    fn () => Inertia::render('cinema-experience')
)->name('cinema.experience');

// CINESIGHT_SEAT_DISCOVERY_V1
Route::get(
    '/cinema/discover',
    fn () => Inertia::render('cinema-discover')
)->name('cinema.discover');

// CINESIGHT_SEAT_COMPARISON_V1
Route::get(
    '/cinema/compare',
    fn () => Inertia::render('cinema-compare')
)->name('cinema.compare');

// CINESIGHT_SEPARATE_RESULTS_PAGE_V1
Route::get(
    '/cinema/results',
    fn () => Inertia::render('cinema-results')
)->name('cinema.results');
