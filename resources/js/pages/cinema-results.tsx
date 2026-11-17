import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { getStudioSeats, type ApiSeat } from '@/lib/cinema/seatApi';
import {
    recommendSeats,
    type ViewingPreference,
} from '@/lib/cinema/seatRecommendation';
import { discoveryCSS } from './cinema-discover-styles';
import { chooseContrastingSeat } from '@/lib/cinema/comparisonSeat';

type Zone = 'rear' | 'middle' | 'front';
type Priority = 'balanced' | 'center' | 'immersive';

const rowOptions: Record<Zone, string[]> = {
    rear: ['B', 'C'],
    middle: ['E', 'F'],
    front: ['H', 'I'],
};

export default function CinemaResults() {
    const params = new URLSearchParams(
        typeof window === 'undefined' ? '' : window.location.search,
    );

    const requestedZone = params.get('zone');
    const requestedPriority = params.get('priority');

    const zone: Zone =
        requestedZone === 'rear' || requestedZone === 'front'
            ? requestedZone
            : 'middle';

    const priority: Priority =
        requestedPriority === 'center' ||
        requestedPriority === 'immersive'
            ? requestedPriority
            : 'balanced';

    const [apiSeats, setApiSeats] = useState<ApiSeat[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        getStudioSeats(controller.signal)
            .then((items) => {
                if (controller.signal.aborted) return;
                setApiSeats(items);
                setError(null);
            })
            .catch((caught: unknown) => {
                if (controller.signal.aborted) return;
                setApiSeats(null);
                setError(
                    caught instanceof Error
                        ? caught.message
                        : 'Seat database unavailable',
                );
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, []);

    const recommendations = useMemo(() => {
        if (!apiSeats) return [];

        const activeIds = new Set(
            apiSeats
                .filter((seat) => seat.is_active)
                .map((seat) => seat.seat_id),
        );

        const enginePreference: ViewingPreference =
            priority === 'immersive' ? 'immersive' : 'balanced';

        const ranked = recommendSeats(enginePreference, 180)
            .filter(
                (item) =>
                    activeIds.has(item.seatId) &&
                    rowOptions[zone].includes(item.seat.row),
            );

        if (priority === 'center') {
            ranked.sort(
                (a, b) =>
                    Math.abs(a.seat.number - 9.5) -
                        Math.abs(b.seat.number - 9.5) ||
                    b.score - a.score ||
                    a.seatId.localeCompare(b.seatId),
            );
        }

        return ranked.slice(0, 4);
    }, [apiSeats, zone, priority]);

    const editUrl =
        '/cinema/discover?zone=' +
        encodeURIComponent(zone) +
        '&priority=' +
        encodeURIComponent(priority);

    const activeCompareIds =
        apiSeats
            ?.filter((seat) => seat.is_active)
            .map((seat) => seat.seat_id) ?? [];

    const compareLeft = recommendations[0]?.seatId ?? '';

    const compareRight = chooseContrastingSeat(
        compareLeft,
        activeCompareIds,
    );

    const compareUrl =
        compareLeft && compareRight
            ? '/cinema/compare?left=' +
              encodeURIComponent(compareLeft) +
              '&right=' +
              encodeURIComponent(compareRight)
            : '/cinema/compare';

    return (
        <main className="sd-page">
            <Head title="Seat Results | CineSight-X" />
            <style>{discoveryCSS}</style>

            <div className="sd-shell">
                <header className="sd-navbar">
                    <a href="/cinema" className="sd-brand">
                        <span className="sd-brand-icon">CX</span>
                        CineSight <span>X</span>
                    </a>
                    <a href={editUrl} className="sd-back">
                        Edit Preferences
                    </a>
                </header>

                <section className="sd-hero">
                    <div className="sd-eyebrow">
                        <span className="sd-eyebrow-line" />
                        CINESIGHT-X / DISCOVERY RESULTS
                    </div>

                    <h1>
                        Your Seat Matches.
                        <span> Ready to Explore.</span>
                    </h1>

                    <p>
                        Personalized geometry-based recommendations
                        for your cinema experience.
                    </p>

                    <div className="sd-progress">
                        <span>01 Preferences</span>
                        <span className="sd-progress-divider">/</span>
                        <span className="sd-progress-active">
                            02 Recommendations
                        </span>
                        <span className="sd-progress-divider">/</span>
                        <span>03 Cinema POV</span>
                    </div>
                </section>

                <section className="sd-results" style={{ marginTop: 0 }}>
                    <div className="sd-result-header">
                        <div>
                            <div className="sd-kicker">
                                YOUR PERSONALIZED RESULTS
                            </div>
                            <h2>Discover Your Best Viewing Positions.</h2>
                            <p>
                                Zone: {zone.toUpperCase()} |
                                Priority: {priority.toUpperCase()}
                            </p>
                        </div>
                        <span className="sd-result-badge">
                            {recommendations.length} SEAT MATCHES
                        </span>
                    </div>

                    {loading && (
                        <p role="status" style={{ color: '#a3becb', marginTop: 28 }}>
                            Connecting to the seat database...
                        </p>
                    )}

                    {error && (
                        <p role="alert" style={{ color: '#ff9b9b', marginTop: 28 }}>
                            Database unavailable: {error}
                        </p>
                    )}

                    {!loading && !error && recommendations.length === 0 && (
                        <p role="status" style={{ color: '#cbd5e1', marginTop: 28 }}>
                            No active seats match this preference.
                            Try another viewing zone.
                        </p>
                    )}

                    {recommendations.length > 0 && (
                        <div className="sd-result-grid">
                            {recommendations.map((item, index) => (
                                <article className="sd-result-card" key={item.seatId}>
                                    <span>
                                        RANK 0{index + 1} / RECOMMENDED
                                    </span>
                                    <strong>{item.seatId}</strong>
                                    <small>
                                        Geometry score: {item.score}/100
                                    </small>

                                    <p style={{
                                        color: '#9fb2c5',
                                        fontSize: 11,
                                        lineHeight: 1.6,
                                        margin: '4px 0',
                                    }}>
                                        {item.reasons.join(' / ')}
                                    </p>

                                    <a
                                        href={
                                            '/cinema/experience?seat=' +
                                            encodeURIComponent(item.seatId)
                                        }
                                        style={{
                                            display: 'block',
                                            textAlign: 'center',
                                            marginTop: 'auto',
                                            padding: 12,
                                            background: '#2de2c5',
                                            color: '#06211f',
                                            borderRadius: 9,
                                            textDecoration: 'none',
                                            fontSize: 12,
                                            fontWeight: 800,
                                        }}
                                    >
                                        Preview POV
                                    </a>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="sd-result-bottom" style={{ marginTop: 24 }}>
                        <p>
                            Suggestions use currently active seats and
                            experimental viewing geometry. Seat status is not
                            live ticket-booking availability, and scores do not
                            guarantee real-world comfort.
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 10,
                        }}>
                            {recommendations.length >= 2 && (
                                <a href={compareUrl}>
                                    Compare Different Views
                                </a>
                            )}

                            <a href="/cinema/experience">
                                Explore Cinema 3D
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
