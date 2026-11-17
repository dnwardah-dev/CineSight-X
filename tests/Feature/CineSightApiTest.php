<?php

namespace Tests\Feature;

use Database\Seeders\CineSightStudioSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CineSightApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(CineSightStudioSeeder::class);
    }

    public function test_studio_is_loaded_from_database(): void
    {
        $this->getJson('/api/v1/studios/1')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_seats', 180)
            ->assertJsonPath('data.active_seats', 180)
            ->assertJsonPath('data.source', 'database');
    }

    public function test_inventory_contains_180_seats(): void
    {
        $this->getJson('/api/v1/studios/1/seats')
            ->assertOk()
            ->assertJsonPath('data.total_seats', 180)
            ->assertJsonPath('data.active_seats', 180)
            ->assertJsonCount(180, 'data.seats');
    }

    public function test_seat_e9_has_correct_details(): void
    {
        $this->getJson('/api/v1/studios/1/seats/E9')
            ->assertOk()
            ->assertJsonPath('data.seat_id', 'E9')
            ->assertJsonPath('data.row', 'E')
            ->assertJsonPath('data.number', 9)
            ->assertJsonPath('data.is_active', true);
    }

    public function test_unknown_studio_returns_404(): void
    {
        $this->getJson('/api/v1/studios/999')
            ->assertNotFound();
    }

    public function test_invalid_seat_identifier_returns_404(): void
    {
        $this->getJson('/api/v1/studios/1/seats/INVALID')
            ->assertNotFound();
    }

    public function test_seat_number_above_18_returns_404(): void
    {
        $this->getJson('/api/v1/studios/1/seats/E19')
            ->assertNotFound();
    }
}
