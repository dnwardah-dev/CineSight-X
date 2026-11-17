<?php

namespace Database\Seeders;

use App\Models\Seat;
use App\Models\Studio;
use Illuminate\Database\Seeder;

class CineSightStudioSeeder extends Seeder
{
    public function run(): void
    {
        $studio = Studio::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'CineSight Studio 01',
                'type' => 'Cinema POV Simulator',
                'rows' => range('A', 'J'),
                'seats_per_row' => 18,
                'screen' => [
                    'width' => 14.0,
                    'height' => 6.0,
                    'bottom' => 1.2,
                ],
                'geometry' => [
                    'seat_spacing' => 0.68,
                    'row_spacing' => 1.15,
                    'row_elevation' => 0.25,
                    'front_row_distance' => 6.0,
                ],
            ]
        );

        foreach (range('A', 'J') as $row) {
            for ($number = 1; $number <= 18; $number++) {
                Seat::firstOrCreate(
                    [
                        'studio_id' => $studio->id,
                        'row_label' => $row,
                        'number' => $number,
                    ],
                    ['is_active' => true]
                );
            }
        }

        $this->command?->info(
            'CineSight seeded: '.
            $studio->seats()->count().
            ' seats'
        );
    }
}
