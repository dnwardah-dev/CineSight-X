import {
    CINEMA_CONFIG,
    getSeatCameraPosition,
    getScreenViewingAngles,
    type CinemaSeat,
} from './cinemaGeometry';

export type ViewingPreference =
    | 'balanced'
    | 'immersive'
    | 'relaxed';

export type SeatRecommendation = {
    seat: CinemaSeat;
    seatId: string;
    score: number;
    horizontalAngle: number;
    verticalAngle: number;
    distance: number;
    reasons: string[];
};

const PROFILES = {
    balanced: {
        targetWidthAngle: 45,
        targetVerticalAngle: 10,
    },
    immersive: {
        targetWidthAngle: 60,
        targetVerticalAngle: 15,
    },
    relaxed: {
        targetWidthAngle: 35,
        targetVerticalAngle: 8,
    },
} as const;

function clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
}

export function analyzeSeat(
    seat: CinemaSeat,
    preference: ViewingPreference = 'balanced',
): SeatRecommendation {
    const camera = getSeatCameraPosition(seat);
    const angles = getScreenViewingAngles(seat);
    const profile = PROFILES[preference];

    const centerOffset = Math.abs(
        Math.atan2(camera.x, camera.z) * 180 / Math.PI
    );

    const widthScore = clamp(
        100 -
        Math.abs(
            angles.horizontalAngle -
            profile.targetWidthAngle
        ) * 2.2
    );

    const verticalScore = clamp(
        100 -
        Math.abs(
            angles.verticalCenterAngle -
            profile.targetVerticalAngle
        ) * 3
    );

    const centerScore = clamp(
        100 - centerOffset * 2
    );

    const score = (
        widthScore * 0.50 +
        verticalScore * 0.20 +
        centerScore * 0.30
    );

    const reasons: string[] = [];

    if (centerOffset < 5) {
        reasons.push('Posisi mendekati tengah layar');
    } else {
        reasons.push('Posisi agak menyamping dari layar');
    }

    if (angles.horizontalAngle >= 55) {
        reasons.push('Layar memenuhi area pandang yang luas');
    } else if (angles.horizontalAngle >= 35) {
        reasons.push('Ukuran layar dalam pandangan sedang');
    } else {
        reasons.push('Layar terlihat relatif kecil');
    }

    if (angles.verticalCenterAngle > 20) {
        reasons.push('Perlu melihat cukup tinggi ke arah layar');
    }

    return {
        seat,
        seatId: `${seat.row}${seat.number}`,
        score: Number(score.toFixed(1)),
        horizontalAngle: angles.horizontalAngle,
        verticalAngle: angles.verticalCenterAngle,
        distance: Number(
            Math.hypot(
                camera.x,
                camera.z
            ).toFixed(2)
        ),
        reasons,
    };
}

export function recommendSeats(
    preference: ViewingPreference = 'balanced',
    limit = 5,
): SeatRecommendation[] {
    const results: SeatRecommendation[] = [];

    for (const row of CINEMA_CONFIG.rows) {
        for (
            let number = 1;
            number <= CINEMA_CONFIG.seatsPerRow;
            number++
        ) {
            results.push(
                analyzeSeat({ row, number }, preference)
            );
        }
    }

    return results
        .sort((a, b) =>
            b.score - a.score ||
            a.seatId.localeCompare(b.seatId)
        )
        .slice(0, Math.max(0, Math.floor(limit)));
}
