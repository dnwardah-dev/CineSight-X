import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { getStudioSeats, type ApiSeat } from '@/lib/cinema/seatApi';
import { chooseContrastingSeat } from '@/lib/cinema/comparisonSeat';
import {
    analyzeSeat,
    type ViewingPreference,
} from '@/lib/cinema/seatRecommendation';

type Comparison = ReturnType<typeof analyzeSeat>;

function analyzeId(
    id: string,
    preference: ViewingPreference,
): Comparison | null {
    const match = /^([A-J])(1[0-8]|[1-9])$/.exec(id);

    if (!match) return null;

    return analyzeSeat(
        { row: match[1], number: Number(match[2]) },
        preference,
    );
}

export default function CinemaCompare() {
    const [seats, setSeats] = useState<ApiSeat[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [leftId, setLeftId] = useState('E10');
    const [rightId, setRightId] = useState('H5');
    const [preference, setPreference] =
        useState<ViewingPreference>('balanced');

    useEffect(() => {
        const controller = new AbortController();

        getStudioSeats(controller.signal)
            .then((items) => {
                const active = items
                    .filter((seat) => seat.is_active)
                    .map((seat) => seat.seat_id);

                setSeats(items);

                const params = new URLSearchParams(window.location.search);
                const requestedLeft = params.get('left')?.toUpperCase();
                const requestedRight = params.get('right')?.toUpperCase();

                const first =
                    requestedLeft && active.includes(requestedLeft)
                        ? requestedLeft
                        : active.includes('E10')
                          ? 'E10'
                          : active[0] ?? '';

                const second =
                    requestedRight &&
                    requestedRight !== first &&
                    active.includes(requestedRight)
                        ? requestedRight
                        : chooseContrastingSeat(first, active);

                setLeftId(first);
                setRightId(second);
                setError(null);
            })
            .catch((caught: unknown) => {
                if (!controller.signal.aborted) {
                    setError(
                        caught instanceof Error
                            ? caught.message
                            : 'Cannot load seat data',
                    );
                    setSeats(null);
                }
            });

        return () => controller.abort();
    }, []);

    const activeIds = useMemo(
        () =>
            seats
                ?.filter((seat) => seat.is_active)
                .map((seat) => seat.seat_id) ?? [],
        [seats],
    );

    const left = activeIds.includes(leftId)
        ? analyzeId(leftId, preference)
        : null;

    const right = activeIds.includes(rightId)
        ? analyzeId(rightId, preference)
        : null;

    const canCompare =
        left !== null && right !== null && leftId !== rightId;

    function renderSeat(
        label: string,
        id: string,
        otherId: string,
        onChange: (id: string) => void,
        result: Comparison | null,
    ) {
        return (
            <article className="cc-card">
                <div className="cc-kicker">{label}</div>

                <label className="cc-select-label" htmlFor={`cc-${label}`}>
                    SELECT YOUR SEAT
                </label>

                <select
                    id={`cc-${label}`}
                    value={id}
                    onChange={(event) => onChange(event.target.value)}
                    disabled={!activeIds.length}
                    className="cc-select"
                >
                    {activeIds.length === 0 && (
                        <option value="">No active seats</option>
                    )}

                    {activeIds.map((seatId) => (
                        <option
                            key={seatId}
                            value={seatId}
                            disabled={seatId === otherId}
                        >
                            Seat {seatId}
                        </option>
                    ))}
                </select>

                {result ? (
                    <>
                        <div className="cc-seat-name">{result.seatId}</div>
                        <div className="cc-score">
                            <strong>{result.score.toFixed(1)}</strong>
                            <span>/ 100 · GEOMETRY SCORE</span>
                        </div>

                        <div className="cc-metrics">
                            <div>
                                <span>Horizontal viewing angle</span>
                                <strong>{result.horizontalAngle.toFixed(1)}°</strong>
                            </div>
                            <div>
                                <span>Vertical viewing angle</span>
                                <strong>{result.verticalAngle.toFixed(1)}°</strong>
                            </div>
                            <div>
                                <span>Estimated viewing distance</span>
                                <strong>{result.distance.toFixed(2)} m</strong>
                            </div>
                        </div>

                        <div className="cc-reasons">
                            {result.reasons.map((reason, index) => (
                                <p key={index}>{reason}</p>
                            ))}
                        </div>

                        <a
                            className="cc-pov"
                            href={`/cinema/experience?seat=${result.seatId}`}
                        >
                            Preview {result.seatId} POV →
                        </a>
                    </>
                ) : (
                    <p className="cc-empty">No active seat selected.</p>
                )}
            </article>
        );
    }

    return (
        <main className="cc-page">
            <Head title="Compare Seats | CineSight-X" />

            <style>{`
                .cc-page {
                    min-height: 100vh;
                    background: #060e18;
                    color: #f7fafc;
                    padding: 24px clamp(15px, 4vw, 60px) 70px;
                    font-family: Inter, system-ui, sans-serif;
                }
                .cc-page * { box-sizing: border-box; }
                .cc-shell { max-width: 1300px; margin: auto; }
                .cc-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    padding-bottom: 24px;
                    border-bottom: 1px solid #253a48;
                }
                .cc-brand {
                    color: white;
                    font-size: 21px;
                    font-weight: 800;
                    text-decoration: none;
                }
                .cc-brand span { color: #2de2c5; }
                .cc-back {
                    color: #b5c9d4;
                    font-size: 13px;
                    text-decoration: none;
                    border: 1px solid #385061;
                    padding: 11px 15px;
                    border-radius: 10px;
                }
                .cc-hero { padding: 48px 0 32px; }
                .cc-kicker {
                    color: #2de2c5;
                    font-size: 11px;
                    letter-spacing: 1.8px;
                    font-weight: 800;
                }
                .cc-hero h1 {
                    font-family: 'Space Grotesk', Inter, sans-serif;
                    font-weight: 700;
                    font-size: clamp(35px, 5vw, 64px);
                    letter-spacing: -.05em;
                    line-height: 1.1;
                    margin: 15px 0;
                }
                .cc-hero h1 span { color: #2de2c5; }
                .cc-hero p {
                    color: #9bb2c2;
                    font-size: 14px;
                    line-height: 1.8;
                }
                .cc-toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 12px;
                    padding: 18px;
                    margin-bottom: 20px;
                    border: 1px solid #304757;
                    background: #101d2b;
                    border-radius: 14px;
                }
                .cc-toolbar label { color: #b8ccd7; font-size: 13px; }
                .cc-select {
                    width: 100%;
                    margin-top: 10px;
                    padding: 12px;
                    border: 1px solid #385366;
                    border-radius: 10px;
                    background: #081622;
                    color: white;
                    font: inherit;
                    cursor: pointer;
                }
                .cc-toolbar .cc-select {
                    width: auto;
                    min-width: 185px;
                    margin: 0;
                }
                .cc-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 20px;
                }
                .cc-card {
                    min-width: 0;
                    background: #101e2b;
                    border: 1px solid #355466;
                    border-radius: 20px;
                    padding: clamp(18px, 3vw, 30px);
                }
                .cc-card:first-child { border-color: #287c71; }
                .cc-select-label {
                    display: block;
                    color: #8ca7b9;
                    font-size: 10px;
                    letter-spacing: 1.3px;
                    margin-top: 25px;
                }
                .cc-seat-name {
                    font-family: 'Space Grotesk', Inter, sans-serif;
                    font-size: clamp(54px, 7vw, 92px);
                    color: #2de2c5;
                    font-weight: 700;
                    letter-spacing: -.07em;
                    line-height: 1.2;
                    margin-top: 20px;
                }
                .cc-score {
                    display: flex;
                    align-items: baseline;
                    gap: 12px;
                    margin-bottom: 28px;
                }
                .cc-score strong { font-size: 30px; }
                .cc-score span { color: #8fa9b7; font-size: 11px; }
                .cc-metrics { display: grid; gap: 10px; }
                .cc-metrics div {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 10px;
                    padding: 14px;
                    border-radius: 10px;
                    background: #091725;
                }
                .cc-metrics span { color: #9bb0bf; font-size: 12px; }
                .cc-metrics strong { color: #f8fafc; font-size: 14px; }
                .cc-reasons {
                    min-height: 75px;
                    margin: 23px 0;
                    color: #a3becb;
                    font-size: 12px;
                    line-height: 1.5;
                }
                .cc-reasons p { margin: 5px 0; }
                .cc-pov {
                    display: block;
                    padding: 16px;
                    text-align: center;
                    border-radius: 11px;
                    background: #2de2c5;
                    color: #052420;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 13px;
                }
                .cc-empty, .cc-notice {
                    color: #f0bb89;
                    font-size: 13px;
                    line-height: 1.8;
                }
                .cc-notice {
                    padding: 17px;
                    margin-bottom: 20px;
                    border: 1px solid #785b3e;
                    border-radius: 12px;
                }
                .cc-footer {
                    margin-top: 24px;
                    color: #829dad;
                    font-size: 12px;
                    line-height: 1.8;
                }
                @media (max-width: 700px) {
                    .cc-hero { padding: 34px 0 20px; }
                    .cc-grid { grid-template-columns: 1fr; }
                    .cc-toolbar .cc-select { width: 100%; }
                    .cc-toolbar label { width: 100%; }
                }

/* CINESIGHT_VERSUS_EXPERIENCE_V1 */

.cc-page {
    background:
        radial-gradient(ellipse 42% 45% at 22% 42%,
            rgba(24, 153, 147, .17), transparent 85%),
        radial-gradient(ellipse 42% 45% at 80% 43%,
            rgba(38, 103, 179, .16), transparent 85%),
        #030914;
}

.cc-nav {
    border-bottom-color: rgba(107, 235, 216, .21);
}

.cc-hero {
    position: relative;
    text-align: center;
    padding: 72px 0 42px;
}

.cc-hero h1 {
    font-size: clamp(42px, 6vw, 83px);
    line-height: 1.03;
    letter-spacing: -.07em;
    max-width: 1100px;
    margin: 20px auto;
}

.cc-hero h1 span {
    background: linear-gradient(
        105deg, #baffed, #35e8cf, #82b9ff
    );
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
}

.cc-hero p {
    max-width: 650px;
    margin: 0 auto;
}

.cc-toolbar {
    background: rgba(12, 29, 42, .85);
    border: 1px solid rgba(85, 211, 193, .28);
    border-radius: 16px;
    backdrop-filter: blur(14px);
    box-shadow: 0 20px 65px rgba(0, 0, 0, .2);
}

.cc-grid {
    position: relative;
    gap: 24px;
    align-items: stretch;
}

.cc-grid::after {
    content: 'VS';
    position: absolute;
    z-index: 4;
    pointer-events: none;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    place-items: center;
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: #061722;
    border: 1px solid #51e9d3;
    color: #a6fff0;
    font: 800 23px 'Space Grotesk', sans-serif;
    letter-spacing: -.05em;
    box-shadow:
        0 0 0 9px rgba(3, 12, 23, .85),
        0 0 55px rgba(43, 225, 196, .28);
}

.cc-card {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-radius: 25px;
    padding: clamp(22px, 3vw, 38px);
    background: linear-gradient(
        153deg, #102d38, #071724 72%
    );
    box-shadow:
        0 32px 90px rgba(0, 0, 0, .32),
        inset 0 1px 0 rgba(201, 255, 245, .08);
    transition:
        border-color .25s ease,
        transform .25s ease,
        box-shadow .25s ease;
}

.cc-card:first-child {
    border-color: rgba(53, 235, 203, .66);
}

.cc-card:nth-child(2) {
    border-color: rgba(106, 167, 237, .55);
    background: linear-gradient(
        153deg, #172943, #071724 75%
    );
}

.cc-card::before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 310px;
    height: 310px;
    right: -145px;
    top: -170px;
    border-radius: 50%;
    background: rgba(47, 235, 198, .15);
    filter: blur(65px);
    pointer-events: none;
}

.cc-card:nth-child(2)::before {
    background: rgba(75, 152, 255, .16);
}

.cc-card:hover {
    transform: translateY(-5px);
    border-color: #84fff0;
    box-shadow:
        0 40px 100px rgba(0, 0, 0, .38),
        0 0 50px rgba(42, 228, 200, .08);
}

.cc-kicker {
    letter-spacing: 2.5px;
    font-size: 11px;
}

.cc-card:nth-child(2) .cc-kicker {
    color: #9dbfff;
}

.cc-select {
    border-radius: 12px;
    background: #061622;
    border-color: #39606e;
    min-height: 48px;
}

.cc-select:focus-visible {
    outline: 2px solid #55f3da;
    outline-offset: 3px;
}

.cc-seat-name {
    font-size: clamp(75px, 9vw, 145px);
    letter-spacing: -.09em;
    line-height: 1;
    margin: 33px 0 17px;
    text-shadow: 0 0 60px rgba(45, 226, 197, .2);
}

.cc-card:nth-child(2) .cc-seat-name {
    color: #a8caff;
    text-shadow: 0 0 60px rgba(75, 152, 255, .2);
}

.cc-score {
    gap: 15px;
    border-bottom: 1px solid rgba(143, 222, 221, .16);
    padding-bottom: 26px;
}

.cc-score strong {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 40px;
}

.cc-metrics {
    gap: 11px;
}

.cc-metrics div {
    background: rgba(5, 18, 29, .7);
    border: 1px solid rgba(92, 161, 175, .16);
    padding: 18px;
    border-radius: 12px;
}

.cc-metrics strong {
    color: #a4ffeb;
    font-variant-numeric: tabular-nums;
}

.cc-card:nth-child(2) .cc-metrics strong {
    color: #b7d2ff;
}

.cc-reasons {
    color: #aec7d3;
}

.cc-pov {
    border-radius: 12px;
    min-height: 51px;
    display: grid;
    place-items: center;
    background: linear-gradient(
        110deg, #24d9be, #83fbe4
    );
    transition: transform .2s, box-shadow .2s;
}

.cc-card:nth-child(2) .cc-pov {
    background: linear-gradient(
        110deg, #9ec5ff, #d3e5ff
    );
    color: #10213a;
}

.cc-pov:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(45, 226, 197, .19);
}

@media (max-width: 700px) {
    .cc-hero {
        padding: 43px 0 26px;
    }

    .cc-grid {
        grid-template-columns: 1fr;
        gap: 22px;
    }

    .cc-grid::after {
        display: none;
    }

    .cc-card {
        padding: 21px;
    }

    .cc-seat-name {
        font-size: clamp(74px, 17vw, 110px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .cc-card,
    .cc-pov {
        transition: none;
    }
}

            `}</style>

            <div className="cc-shell">
                <nav className="cc-nav">
                    <a href="/cinema" className="cc-brand">
                        CineSight <span>X</span>
                    </a>
                    <a href="/cinema/discover" className="cc-back">
                        ← Seat Discovery
                    </a>
                </nav>

                <section className="cc-hero">
                    <div className="cc-kicker">
                        CINESIGHT-X / SEAT COMPARISON
                    </div>
                    <h1>
                        Two Seats. <span>One Better Decision.</span>
                    </h1>
                    <p>
                        Explore side-by-side viewing geometry and
                        preview each seat from its own cinematic perspective.
                    </p>
                </section>

                <div className="cc-toolbar">
                    <label htmlFor="comparison-profile">
                        VIEWING PROFILE
                    </label>
                    <select
                        id="comparison-profile"
                        className="cc-select"
                        value={preference}
                        onChange={(event) =>
                            setPreference(
                                event.target.value as ViewingPreference,
                            )
                        }
                    >
                        <option value="balanced">Balanced</option>
                        <option value="immersive">Immersive</option>
                        <option value="relaxed">Relaxed</option>
                    </select>
                    <span style={{ color: '#2de2c5', fontSize: 12 }}>
                        {seats
                            ? `${activeIds.length} ACTIVE SEATS`
                            : 'CONNECTING TO DATABASE...'}
                    </span>
                </div>

                {error && (
                    <div className="cc-notice" role="alert">
                        Seat database unavailable: {error}
                    </div>
                )}

                {seats && activeIds.length < 2 && (
                    <div className="cc-notice">
                        At least two active seats are needed for comparison.
                    </div>
                )}

                <div className="cc-grid">
                    {renderSeat('SEAT A', leftId, rightId, setLeftId, left)}
                    {renderSeat('SEAT B', rightId, leftId, setRightId, right)}
                </div>

                {seats && !canCompare && activeIds.length >= 2 && (
                    <p className="cc-notice" role="status">
                        Choose two different active seats to compare.
                    </p>
                )}

                <p className="cc-footer">
                    Geometry scores, estimated viewing distances, and
                    angles are experimental calculations. They do not
                    guarantee real-world comfort or ticket availability.
                </p>
            </div>
        </main>
    );
}