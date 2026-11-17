<?php

namespace App\Console\Commands;

use App\Models\Seat;
use Illuminate\Console\Command;

class ManageSeatStatus extends Command
{
    protected $signature = 'cinesight:seat-status
        {seat : Seat identifier, e.g. E9}
        {--studio=1 : Studio ID}
        {--active : Activate seat}
        {--inactive : Deactivate seat}';

    protected $description = 'Manage CineSight seat active status';

    public function handle(): int
    {
        $active = (bool) $this->option('active');
        $inactive = (bool) $this->option('inactive');

        if ($active === $inactive) {
            $this->error(
                'Choose exactly one: --active or --inactive'
            );

            return self::FAILURE;
        }

        $seatId = strtoupper((string) $this->argument('seat'));

        if (! preg_match(
            '/^([A-J])(1[0-8]|[1-9])$/',
            $seatId,
            $matches
        )) {
            $this->error('Invalid seat identifier.');

            return self::FAILURE;
        }

        $studioId = filter_var(
            $this->option('studio'),
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 1]]
        );

        if ($studioId === false) {
            $this->error('Invalid studio ID.');

            return self::FAILURE;
        }

        $seat = Seat::query()
            ->where('studio_id', $studioId)
            ->where('row_label', $matches[1])
            ->where('number', (int) $matches[2])
            ->first();

        if (! $seat) {
            $this->error('Seat not found in database.');

            return self::FAILURE;
        }

        $seat->is_active = $active;
        $seat->save();

        $this->info(
            "Seat {$seatId} updated: ".
            ($active ? 'ACTIVE' : 'INACTIVE')
        );

        return self::SUCCESS;
    }
}
