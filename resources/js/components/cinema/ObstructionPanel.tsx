import { calculateObstruction } from '@/lib/cinema/obstruction';

type Seat = {
    id: string;
    row: string;
    number: number;
    x: number;
    y: number;
    z: number;
};

const ROWS = 'ABCDEFGHIJ';

export default function ObstructionPanel({ seat }: { seat: Seat }) {
    const rowIndex = ROWS.indexOf(seat.row);

    const frontRowExists = rowIndex >= 0 && rowIndex < 9;

    const frontSeat = {
        x: seat.x,
        y: seat.y - 0.28,
        z: seat.z - 1.2,
    };

    const result = frontRowExists
        ? calculateObstruction(
            { x: seat.x, y: seat.y + 1.2, z: seat.z },
            { x: 0, y: 4, z: -8 },
            frontSeat,
            1.2,
        )
        : null;

    return (
        <div className="cx-live-analysis" style={{
            position: 'absolute',
            top: 95,
            right: 20,
            zIndex: 2,
            width: 260,
            maxWidth: 'calc(100% - 40px)',
            padding: 18,
            borderRadius: 15,
            background: '#07111de8',
            border: '1px solid #ffffff30',
            backdropFilter: 'blur(16px)',
            color: 'white',
            pointerEvents: 'none',
        }}>
            <div style={{
                color: '#2dd4bf',
                fontSize: 10,
                letterSpacing: 2,
                fontWeight: 800,
            }}>
                LIVE VIEW ANALYSIS
            </div>

            <div style={{
                fontSize: 25,
                fontWeight: 800,
                marginTop: 10,
            }}>
                Seat {seat.id}
            </div>

            <div style={{
                color: '#94a3b8',
                fontSize: 12,
                marginTop: 8,
            }}>
                {result === null
                    ? 'No front row to analyze.'
                    : result.obstructed
                        ? 'Potential vertical obstruction'
                        : 'Center sightline clears estimated head height'}
            </div>

            {result && (
                <div style={{
                    marginTop: 14,
                    fontSize: 13,
                    color: result.obstructed ? '#fbbf24' : '#2dd4bf',
                }}>
                    Clearance: {result.clearanceMeters.toFixed(3)} m
                </div>
            )}

            <p style={{
                color: '#64748b',
                fontSize: 10,
                lineHeight: 1.5,
                marginTop: 12,
            }}>
                Experimental vertical sightline estimate.
                Not a full-screen visibility assessment.
            </p>
        </div>
    );
}
