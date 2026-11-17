import { useState } from 'react';
import { getPOVZone, getPOVImagePath } from '@/lib/cinema/povZones';

type Props = {
    row: string;
    number: number;
};

const fallback =
    '/cinema/studio-01/pov/middle-center/view.webp';

export default function CinemaBackground({ row, number }: Props) {
    const zone = getPOVZone(row, number);
    const imagePath = getPOVImagePath(row, number);

    const [failedPath, setFailedPath] = useState('');

    const imageSrc =
        failedPath === imagePath ? fallback : imagePath;

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            background: '#080b12',
        }}>
            <img
                key={imageSrc}
                src={imageSrc}
                alt={`Illustrative cinema view: ${zone}`}
                onError={() => setFailedPath(imagePath)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    animation: 'cinemaReveal 0.8s ease-out',
                }}
            />

            <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background:
                    'linear-gradient(to bottom, #0005, transparent 35%, #0006)',
            }} />

            <style>{`
                @keyframes cinemaReveal {
                    from { opacity: 0.4; }
                    to { opacity: 1; }
                }

                @media (prefers-reduced-motion: reduce) {
                    img { animation: none !important; }
                }
            `}</style>
        </div>
    );
}
