<?php

namespace Tests\Feature;

use App\Models\Seat;
use App\Models\SeatAuditLog;
use App\Models\User;
use Database\Seeders\CineSightStudioSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CineSightAuditLogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(CineSightStudioSeeder::class);
    }

    private function createAdmin(): User
    {
        $user = User::factory()->create();

        $user->forceFill([
            'is_admin' => true,
        ])->save();

        return $user;
    }

    private function findSeat(string $row, int $number): Seat
    {
        return Seat::query()
            ->where('studio_id', 1)
            ->where('row_label', $row)
            ->where('number', $number)
            ->firstOrFail();
    }

    public function test_admin_update_creates_audit_log(): void
    {
        $admin = $this->createAdmin();
        $seat = $this->findSeat('E', 9);

        $this->actingAs($admin)
            ->patch('/cinema/admin/seats/E9', [
                'is_active' => false,
            ])
            ->assertRedirect('/cinema/admin');

        $this->assertDatabaseHas('seats', [
            'id' => $seat->id,
            'is_active' => false,
        ]);

        $this->assertDatabaseCount('seat_audit_logs', 1);

        $log = SeatAuditLog::firstOrFail();

        $this->assertSame('SEAT_STATUS_CHANGED', $log->action);
        $this->assertSame($admin->id, $log->user_id);
        $this->assertSame($seat->id, $log->seat_id);
        $this->assertTrue($log->old_status);
        $this->assertFalse($log->new_status);
        $this->assertSame(1, $log->affected_seats);
    }

    public function test_unchanged_seat_does_not_create_duplicate_log(): void
    {
        $admin = $this->createAdmin();

        $this->actingAs($admin)
            ->patch('/cinema/admin/seats/E9', [
                'is_active' => true,
            ])
            ->assertRedirect('/cinema/admin');

        $this->assertDatabaseCount('seat_audit_logs', 0);
    }

    public function test_activate_all_records_affected_seat_count(): void
    {
        $admin = $this->createAdmin();

        Seat::query()
            ->where('studio_id', 1)
            ->where('row_label', 'E')
            ->whereIn('number', [9, 10])
            ->update(['is_active' => false]);

        $this->actingAs($admin)
            ->post('/cinema/admin/seats/activate-all', [
                'confirmation' => 'ACTIVATE_ALL',
            ])
            ->assertRedirect('/cinema/admin');

        $this->assertSame(
            0,
            Seat::query()
                ->where('studio_id', 1)
                ->where('is_active', false)
                ->count()
        );

        $this->assertDatabaseCount('seat_audit_logs', 1);

        $log = SeatAuditLog::firstOrFail();

        $this->assertSame('ACTIVATE_ALL', $log->action);
        $this->assertSame($admin->id, $log->user_id);
        $this->assertNull($log->seat_id);
        $this->assertFalse($log->old_status);
        $this->assertTrue($log->new_status);
        $this->assertSame(2, $log->affected_seats);
    }

    public function test_activate_all_without_changes_creates_no_log(): void
    {
        $admin = $this->createAdmin();

        $this->actingAs($admin)
            ->post('/cinema/admin/seats/activate-all', [
                'confirmation' => 'ACTIVATE_ALL',
            ])
            ->assertRedirect('/cinema/admin');

        $this->assertDatabaseCount('seat_audit_logs', 0);
    }

    public function test_normal_user_cannot_create_single_seat_audit(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch('/cinema/admin/seats/E9', [
                'is_active' => false,
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('seat_audit_logs', 0);
        $this->assertTrue(
            (bool) $this->findSeat('E', 9)->is_active
        );
    }

    public function test_normal_user_cannot_activate_all(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/cinema/admin/seats/activate-all', [
                'confirmation' => 'ACTIVATE_ALL',
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('seat_audit_logs', 0);
    }

    public function test_invalid_bulk_confirmation_changes_nothing(): void
    {
        $admin = $this->createAdmin();

        $seat = $this->findSeat('E', 9);
        $seat->is_active = false;
        $seat->save();

        $this->actingAs($admin)
            ->post('/cinema/admin/seats/activate-all', [
                'confirmation' => 'INVALID',
            ])
            ->assertSessionHasErrors('confirmation');

        $this->assertFalse(
            (bool) $seat->fresh()->is_active
        );

        $this->assertDatabaseCount('seat_audit_logs', 0);
    }
}
