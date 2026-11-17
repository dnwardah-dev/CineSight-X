import { createPortal } from 'react-dom';
import { useEffect, useMemo, useState } from 'react';
import { getStudioSeats, type ApiSeat } from '@/lib/cinema/seatApi';

import {
    recommendSeats,
    type ViewingPreference,
} from '@/lib/cinema/seatRecommendation';

type Props = {
    onChooseSeat: (row: string, number: number) => void;
};

const preferences: {
    id: ViewingPreference;
    label: string;
    description: string;
}[] = [
    {
        id: 'balanced',
        label: 'Balanced',
        description: 'Pandangan seimbang',
    },
    {
        id: 'immersive',
        label: 'Immersive',
        description: 'Layar terasa lebih besar',
    },
    {
        id: 'relaxed',
        label: 'Relaxed',
        description: 'Pandangan lebih jauh',
    },
];

export default function SeatRecommendationPanel({
    onChooseSeat,
}: Props) {
    const [open, setOpen] = useState(false);

    const [preference, setPreference] =
        useState<ViewingPreference>('balanced');

    // CINESIGHT_SEAT_API_INTEGRATION_V1
    const [apiSeats, setApiSeats] = useState<ApiSeat[] | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        getStudioSeats(controller.signal)
            .then((items) => {
                setApiSeats(items);
                setApiError(null);
            })
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setApiError(
                        error instanceof Error
                            ? error.message
                            : 'Seat API unavailable'
                    );
                }
            });

        return () => controller.abort();
    }, []);

    const [portalTarget, setPortalTarget] =
        useState<HTMLElement | null>(null);

    useEffect(() => {
        setPortalTarget(
            document.getElementById('cxe-smart-seats-slot')
        );
    }, []);

    const recommendations = useMemo(() => {
        if (!apiSeats) return [];

        const activeIds = new Set(
            apiSeats
                .filter((seat) => seat.is_active)
                .map((seat) => seat.seat_id)
        );

        return recommendSeats(preference, 180)
            .filter((item) => activeIds.has(item.seatId))
            .slice(0, 5);
    }, [preference, apiSeats]);

    const smartSeatsPanel = (
        <div className="cx-smart-seats-floating" style={{
            position: 'fixed',
            right: 22,
            bottom: 22,
            zIndex: 9999,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#f5f7fa',
        }}>
            {open && (
                <section
                    role="dialog"
                    aria-label="Smart Seat Recommendations"
                    style={{
                        width: 'min(380px, calc(100vw - 32px))',
                        maxHeight: 'min(70vh, 630px)',
                        overflowY: 'auto',
                        marginBottom: 12,
                        padding: 20,
                        borderRadius: 20,
                        background: '#0b1420',
                        border: '1px solid #ffffff24',
                        boxShadow: '0 20px 70px #000a',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12,
                    }}>
                        <div>
                            <div style={{
                                color: '#35e2c1',
                                fontSize: 10,
                                letterSpacing: 2,
                                fontWeight: 800,
                            }}>
                                CINESIGHT INTELLIGENCE
                            </div>

                            <h3 style={{
                                margin: '8px 0 0',
                                fontSize: 21,
                            }}>
                                Smart Seats
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close recommendations"
                            style={{
                                background: '#ffffff12',
                                color: 'white',
                                border: '1px solid #ffffff20',
                                borderRadius: 8,
                                padding: '8px 12px',
                                cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <p style={{
                        color: '#9caec0',
                        fontSize: 12,
                        lineHeight: 1.7,
                    }}>
                        Find your preferred viewing position
                        using cinema geometry.
                    </p>

                    <p style={{
                        color: apiError ? '#ff9b9b' : '#35e2c1',
                        fontSize: 11,
                        margin: '8px 0',
                    }}>
                        {apiError
                            ? `Seat database unavailable: ${apiError}`
                            : apiSeats
                                ? `Database connected · ${apiSeats.filter(s => s.is_active).length} active seats`
                                : 'Connecting to seat database...'}
                    </p>

                    {!apiError && apiSeats && recommendations.length === 0 && (
                        <p style={{ color: '#cbd5e1', fontSize: 12 }}>
                            No active seats available for recommendation.
                        </p>
                    )}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 7,
                        margin: '18px 0',
                    }}>
                        {preferences.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                title={item.description}
                                aria-pressed={preference === item.id}
                                onClick={() => setPreference(item.id)}
                                style={{
                                    borderRadius: 9,
                                    padding: '11px 5px',
                                    fontSize: 11,
                                    fontWeight: 750,
                                    cursor: 'pointer',
                                    border: '1px solid #ffffff20',
                                    background:
                                        preference === item.id
                                            ? '#35e2c1'
                                            : '#182536',
                                    color:
                                        preference === item.id
                                            ? '#05241d'
                                            : '#cdd9e5',
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 9,
                    }}>
                        {recommendations.map((item, index) => (
                            <div
                                key={item.seatId}
                                style={{
                                    background: '#142131',
                                    border: '1px solid #ffffff14',
                                    borderRadius: 12,
                                    padding: 12,
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 10,
                                }}>
                                    <div>
                                        <div style={{
                                            color: '#8194a8',
                                            fontSize: 10,
                                        }}>
                                            RANK #{index + 1}
                                        </div>

                                        <strong style={{
                                            fontSize: 23,
                                            color: '#ffffff',
                                        }}>
                                            {item.seatId}
                                        </strong>
                                    </div>

                                    <div style={{
                                        textAlign: 'right',
                                    }}>
                                        <strong style={{
                                            color: '#35e2c1',
                                            fontSize: 21,
                                        }}>
                                            {item.score}
                                        </strong>

                                        <div style={{
                                            fontSize: 10,
                                            color: '#8194a8',
                                        }}>
                                            / 100
                                        </div>
                                    </div>
                                </div>

                                <p style={{
                                    color: '#a9b8c8',
                                    fontSize: 11,
                                    margin: '8px 0 12px',
                                    lineHeight: 1.5,
                                }}>
                                    {item.reasons.join(' · ')}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        onChooseSeat(
                                            item.seat.row,
                                            item.seat.number,
                                        );
                                        setOpen(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: 0,
                                        borderRadius: 8,
                                        background: '#263c48',
                                        color: '#d6fff5',
                                        fontWeight: 750,
                                        fontSize: 12,
                                        cursor: 'pointer',
                                    }}
                                >
                                    View POV →
                                </button>
                            </div>
                        ))}
                    </div>

                    <p style={{
                        color: '#8294a6',
                        fontSize: 10,
                        lineHeight: 1.6,
                        marginTop: 14,
                    }}>
                        Scores are experimental geometry-based
                        estimates, not verified comfort ratings.
                        Seat availability is not checked.
                    </p>
                </section>
            )}

            <button
                type="button"
                onClick={() => setOpen(value => !value)}
                aria-expanded={open}
                style={{
                    display: 'block',
                    marginLeft: 'auto',
                    padding: '15px 21px',
                    borderRadius: 13,
                    border: '1px solid #93ffea55',
                    background: '#35e2c1',
                    color: '#06231e',
                    fontWeight: 850,
                    fontSize: 13,
                    cursor: 'pointer',
                    boxShadow: '0 12px 40px #0008',
                }}
            >
                ✦ {open ? 'Close Smart Seats' : 'Smart Seats'}
            </button>
        </div>
    );

    return portalTarget
        ? createPortal(smartSeatsPanel, portalTarget)
        : smartSeatsPanel;
}
