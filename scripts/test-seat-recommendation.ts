import {
    recommendSeats,
    analyzeSeat,
} from '../resources/js/lib/cinema/seatRecommendation';

const preferences = [
    'balanced',
    'immersive',
    'relaxed',
] as const;

for (const preference of preferences) {
    console.log(`\n=== ${preference.toUpperCase()} ===`);

    const results = recommendSeats(preference, 5);

    console.table(
        results.map(item => ({
            Seat: item.seatId,
            Score: item.score,
            HorizontalAngle: item.horizontalAngle,
            VerticalAngle: item.verticalAngle,
            Distance: item.distance,
        }))
    );
}

console.log('\n=== SAMPLE SEAT ANALYSIS ===');

for (const seat of [
    { row: 'A', number: 8 },
    { row: 'F', number: 9 },
    { row: 'J', number: 15 },
]) {
    const result = analyzeSeat(seat, 'balanced');

    console.log(result.seatId, result.score, result.reasons);
}

console.log('\nSMART SEAT ENGINE TEST COMPLETED!');
