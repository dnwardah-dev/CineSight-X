<?php

namespace Tests\Feature;

use App\Models\Seat;
use App\Models\SeatAuditLog;
use App\Models\User;
use Database\Seeders\CineSightStudioSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CineSightActivityPaginationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(CineSightStudioSeeder::class);
    }

    private function admin(string $name = 'Test Administrator'): User
    {
        $user = User::factory()->create(['name' => $name]);

        $user->forceFill(['is_admin' => true])->save();

        return $user;
    }

    private function log(
        User $user,
        string $row = 'E',
        int $number = 10,
        string $action = 'SEAT_STATUS_CHANGED'
    ): void {
        $seat = Seat::query()
            ->where('studio_id', 1)
            ->where('row_label', $row)
            ->where('number', $number)
            ->firstOrFail();

        SeatAuditLog::create([
            'studio_id' => 1,
            'user_id' => $user->id,
            'seat_id' => $action === 'ACTIVATE_ALL'
                ? null
                : $seat->id,
            'action' => $action,
            'old_status' => false,
            'new_status' => true,
            'affected_seats' => 1,
        ]);
    }

    public function test_guest_cannot_read_activity_history(): void
    {
        $this->get('/cinema/admin/activity-history')
            ->assertRedirect('/login');
    }

    public function test_normal_user_cannot_read_activity_history(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/cinema/admin/activity-history')
            ->assertForbidden();
    }

    public function test_admin_can_paginate_twelve_records(): void
    {
        $admin = $this->admin();

        for ($i = 0; $i < 12; $i++) {
            $this->log($admin);
        }

        $this->actingAs($admin)
            ->getJson('/cinema/admin/activity-history?page=1')
            ->assertOk()
            ->assertJsonPath('total', 12)
            ->assertJsonPath('per_page', 10)
            ->assertJsonPath('current_page', 1)
            ->assertJsonPath('last_page', 2)
            ->assertJsonCount(10, 'data');

        $this->getJson('/cinema/admin/activity-history?page=2')
            ->assertOk()
            ->assertJsonPath('current_page', 2)
            ->assertJsonCount(2, 'data');
    }

    public function test_search_finds_matching_seat_records(): void
    {
        $admin = $this->admin();

        for ($i = 0; $i < 3; $i++) {
            $this->log($admin, 'E', 10);
        }

        $this->log($admin, 'C', 2);

        $this->actingAs($admin)
            ->getJson('/cinema/admin/activity-history?search=E10')
            ->assertOk()
            ->assertJsonPath('total', 3)
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.seat_label', 'E10');
    }

    public function test_search_finds_matching_administrator(): void
    {
        $admin = $this->admin('CineSight Audit Tester');
        $other = $this->admin('Another Administrator');

        $this->log($admin);
        $this->log($admin);
        $this->log($other);

        $this->actingAs($admin)
            ->getJson('/cinema/admin/activity-history?search=Audit%20Tester')
            ->assertOk()
            ->assertJsonPath('total', 2)
            ->assertJsonCount(2, 'data');
    }

    public function test_action_filter_returns_only_selected_type(): void
    {
        $admin = $this->admin();

        $this->log($admin, 'E', 10);
        $this->log($admin, 'E', 10);
        $this->log($admin, 'E', 10, 'ACTIVATE_ALL');

        $this->actingAs($admin)
            ->getJson('/cinema/admin/activity-history?action=ACTIVATE_ALL')
            ->assertOk()
            ->assertJsonPath('total', 1)
            ->assertJsonPath('data.0.action', 'ACTIVATE_ALL')
            ->assertJsonCount(1, 'data');
    }

    public function test_invalid_action_filter_is_rejected(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->getJson('/cinema/admin/activity-history?action=DELETE_ALL')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('action');
    }
}
