import {
    calculateEyeLighting,
    type LightingResult,
} from '@/lib/cinema/eyeLighting';

type EyeLightPanelProps = {
    row: string;
    number: number;
};

const ROWS = 'ABCDEFGHIJ';

export default function EyeLightPanel({
    row,
    number,
}: EyeLightPanelProps) {
    const index = ROWS.indexOf(row);

    if (
        index < 0 ||
        number < 1 ||
        number > 18
    ) {
        return null;
    }

    const spacing = 0.65;
    const aisle = 1.2;
    const rowDepth = 1.2;
    const rise = 0.28;

    const eye = {
        x: (number - 9.5) * spacing +
            (number <= 9 ? -aisle / 2 : aisle / 2),
        y: (9 - index) * rise + 1.2,
        z: 10 - index * rowDepth,
    };

    let result: LightingResult;

    try {
        result = calculateEyeLighting({
            eye,
            screenCenter: { x: 0, y: 4, z: -8 },
            screenWidth: 12,
            screenHeight: 5.5,
            luminance: 48,
        });
    } catch {
        return null;
    }

    return (
        <div style={{
            position: 'absolute',
            top: 85,
            right: 20,
            zIndex: 4,
            width: 255,
            maxWidth: 'calc(100% - 40px)',
            borderRadius: 16,
            padding: 18,
            background: '#07111de8',
            border: '1px solid #ffffff30',
            backdropFilter: 'blur(20px)',
            color: '#ffffff',
        }}>
            <div style={{
                color: '#39e6c4',
                fontWeight: 800,
                fontSize: 10,
                letterSpacing: 2,
            }}>
                EYELIGHT INTELLIGENCE
            </div>

            <div style={{
                marginTop: 10,
                fontSize: 23,
                fontWeight: 800,
            }}>
                Seat {row}{number}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginTop: 15,
            }}>
                {[
                    ['Estimated Light', `${result.estimatedLux} lux`],
                    ['Screen Distance', `${result.distanceMeters} m`],
                    ['Horizontal Angle',
                     `${result.horizontalAngleDegrees}°`],
                    ['Screen Width Angle',
                     `${result.viewingAngleDegrees}°`],
                ].map(([label, value]) => (
                    <div key={label}>
                        <div style={{
                            color: '#94a3b8',
                            fontSize: 10,
                            marginBottom: 5,
                        }}>
                            {label}
                        </div>
                        <strong style={{ fontSize: 15 }}>
                            {value}
                        </strong>
                    </div>
                ))}
            </div>

            <p style={{
                fontSize: 10,
                lineHeight: 1.6,
                color: '#8192a5',
                marginTop: 15,
            }}>
                Geometry-based estimate using an assumed
                48 cd/m² screen luminance. Not a medical
                assessment or direct light measurement.
            </p>
        </div>
    );
}
