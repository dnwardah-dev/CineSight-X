<?php

namespace Tests\Feature;

use App\Models\Seat;
use App\Models\User;
use Database\Seeders\CineSightStudioSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CineSightAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(CineSightStudioSeeder::class);
    }

    public function test_guest_cannot_open_admin_dashboard(): void
    {
        $this->get('/cinema/admin')
            ->assertRedirect('/login');
    }

    public function test_normal_user_cannot_open_admin_dashboard(): void
    {
        $user = User::factory()->create();
        $user->is_admin = false;
        $user->save();

        $this->actingAs($user)
            ->get('/cinema/admin')
            ->assertForbidden();
    }

    public function test_normal_user_cannot_update_seat(): void
    {
        $user = User::factory()->create();
        $user->is_admin = false;
        $user->save();

        $this->actingAs($user)
            ->patch('/cinema/admin/seats/E9', [
                'is_active' => false,
            ])
            ->assertForbidden();

        $this->assertDatabaseHas('seats', [
            'studio_id' => 1,
            'row_label' => 'E',
            'number' => 9,
            'is_active' => true,
        ]);
    }

    public function test_admin_can_open_dashboard(): void
    {
        $admin = User::factory()->create();
        $admin->is_admin = true;
        $admin->save();

        $this->actingAs($admin)
            ->get('/cinema/admin')
            ->assertOk();

        $this->assertSame(180, Seat::count());
    }

    public function test_admin_can_update_seat(): void
    {
        $admin = User::factory()->create();
        $admin->is_admin = true;
        $admin->save();

        $this->actingAs($admin)
            ->patch('/cinema/admin/seats/E9', [
                'is_active' => false,
            ])
            ->assertRedirect('/cinema/admin');

        $this->assertDatabaseHas('seats', [
            'studio_id' => 1,
            'row_label' => 'E',
            'number' => 9,
            'is_active' => false,
        ]);
    }
}
