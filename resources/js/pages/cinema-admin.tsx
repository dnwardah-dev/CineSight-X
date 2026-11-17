import ActivityHistoryPanel, { type ActivityLog } from '@/components/cinema/ActivityHistoryPanel';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Seat = {
    id: string;
    row: string;
    number: number;
    is_active: boolean;
};

type Props = {
    auditLogs: ActivityLog[];
    studio: {
        id: number;
        name: string;
        rows: string[];
    };
    seats: Seat[];
    summary: {
        total: number;
        active: number;
        inactive: number;
    };
};

export default function CinemaAdmin({
    studio,
    seats,
    summary,
auditLogs,
}: Props) {
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState('');

    function toggleSeat(seat: Seat) {
        if (busy !== null) return;

        setBusy(seat.id);
        setError('');

        router.patch(
            `/cinema/admin/seats/${seat.id}`,
            { is_active: !seat.is_active },
            {
                preserveScroll: true,
                onError: () => {
                    setError('Gagal mengubah status kursi.');
                },
                onFinish: () => setBusy(null),
            },
        );
    }


    // CINESIGHT_ADMIN_SEARCH_FILTER_V1
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<'all' | 'active' | 'inactive'>('all');

    const visibleSeats = seats.filter(seat => {
        const matchesSearch = seat.id
            .toLowerCase()
            .includes(search.trim().toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active'
                ? seat.is_active
                : !seat.is_active);

        return matchesSearch && matchesStatus;
    });

    const panel: React.CSSProperties = {
        background: '#111c2b',
        border: '1px solid #2b4050',
        borderRadius: 18,
        padding: 22,
    };

    return (
        <>
            <Head title="CineSight Control Center" />
            <style>{"\n/* CINESIGHT_MISSION_CONTROL_V1 */\n\n/* Scoped entirely to the Cinema Admin page */\n.cmc-page {\n    position: relative;\n    isolation: isolate;\n    min-height: 100vh;\n    background:\n        radial-gradient(\n            ellipse 65% 38% at 65% 0%,\n            rgba(24, 151, 138, .2),\n            transparent 75%\n        ),\n        radial-gradient(\n            ellipse 35% 42% at 0% 80%,\n            rgba(34, 84, 153, .13),\n            transparent 85%\n        ),\n        #040c16 !important;\n    color: #eefbff !important;\n    font-family: 'Inter', system-ui, sans-serif !important;\n}\n\n.cmc-page *,\n.cmc-page *::before,\n.cmc-page *::after {\n    box-sizing: border-box;\n}\n\n.cmc-page::before {\n    content: '';\n    position: absolute;\n    z-index: -1;\n    inset: 0;\n    pointer-events: none;\n    background-image:\n        linear-gradient(#55eddf09 1px, transparent 1px),\n        linear-gradient(90deg, #55eddf09 1px, transparent 1px);\n    background-size: 62px 62px;\n    mask-image: linear-gradient(\n        to bottom, black, transparent 65%\n    );\n}\n\n/* Main content */\n.cmc-page > div {\n    max-width: 1460px !important;\n}\n\n/* Command header */\n.cmc-page > div > div:first-child {\n    position: relative;\n    padding: 28px 30px;\n    margin-bottom: 26px !important;\n    background: linear-gradient(\n        125deg,\n        rgba(19, 55, 66, .89),\n        rgba(7, 21, 36, .91)\n    );\n    border: 1px solid rgba(78, 223, 202, .28);\n    border-radius: 22px;\n    box-shadow: 0 22px 75px rgba(0, 0, 0, .25);\n}\n\n.cmc-page > div > div:first-child::after {\n    content: '';\n    position: absolute;\n    pointer-events: none;\n    right: 24px;\n    bottom: -1px;\n    width: 130px;\n    height: 2px;\n    background: linear-gradient(\n        90deg, transparent, #36f1d1\n    );\n    box-shadow: 0 0 22px #36f1d17a;\n}\n\n.cmc-page > div > div:first-child h1 {\n    font-family: 'Space Grotesk', 'Inter', sans-serif;\n    font-size: clamp(28px, 3.3vw, 44px) !important;\n    font-weight: 700 !important;\n    line-height: 1.12 !important;\n    letter-spacing: -.055em;\n    margin: 11px 0 !important;\n    color: #f2fffd !important;\n}\n\n.cmc-page > div > div:first-child p:first-child {\n    color: #49efd3 !important;\n    letter-spacing: 2.5px !important;\n}\n\n.cmc-page > div > div:first-child a {\n    border-radius: 999px !important;\n    background: linear-gradient(\n        110deg, #28dcbf, #77f8de\n    ) !important;\n    color: #041e19 !important;\n    box-shadow: 0 15px 40px rgba(31, 213, 181, .16);\n    transition: transform .2s, box-shadow .2s;\n}\n\n.cmc-page > div > div:first-child a:hover {\n    transform: translateY(-3px);\n    box-shadow: 0 20px 46px rgba(31, 213, 181, .32);\n}\n\n/* KPI cards - only the second direct child */\n.cmc-page > div > div:nth-child(2) {\n    gap: 18px !important;\n    margin-bottom: 28px !important;\n}\n\n.cmc-page > div > div:nth-child(2) > div {\n    position: relative;\n    overflow: hidden;\n    min-height: 153px;\n    padding: 26px !important;\n    border-radius: 19px !important;\n    border: 1px solid rgba(71, 177, 175, .38) !important;\n    background: linear-gradient(\n        145deg, #15303e, #091927\n    ) !important;\n    box-shadow:\n        0 18px 48px rgba(0, 0, 0, .22),\n        inset 0 1px 0 rgba(201, 255, 248, .07);\n    transition: transform .2s, border-color .2s;\n}\n\n.cmc-page > div > div:nth-child(2) > div:hover {\n    transform: translateY(-4px);\n    border-color: #43ecd1 !important;\n}\n\n.cmc-page > div > div:nth-child(2) > div::after {\n    content: '';\n    position: absolute;\n    width: 150px;\n    height: 150px;\n    right: -82px;\n    top: -93px;\n    background: rgba(37, 229, 199, .18);\n    border-radius: 50%;\n    filter: blur(32px);\n    pointer-events: none;\n}\n\n.cmc-page > div > div:nth-child(2) > div > div:first-child {\n    color: #8ab6bf !important;\n    font-size: 10px !important;\n    font-weight: 800;\n    letter-spacing: 1.8px !important;\n}\n\n.cmc-page > div > div:nth-child(2) > div > div:nth-child(2) {\n    font-family: 'Space Grotesk', sans-serif;\n    font-size: clamp(37px, 4vw, 52px) !important;\n    font-weight: 700 !important;\n    letter-spacing: -.06em;\n    font-variant-numeric: tabular-nums;\n}\n\n/* Seat management chamber */\n.cmc-page section {\n    border: 1px solid rgba(68, 193, 183, .36) !important;\n    border-radius: 24px !important;\n    background:\n        radial-gradient(\n            ellipse 60% 40% at 75% 0%,\n            rgba(23, 121, 119, .15),\n            transparent\n        ),\n        linear-gradient(\n            150deg, #102939, #081623 73%\n        ) !important;\n    box-shadow:\n        0 28px 90px rgba(0, 0, 0, .24),\n        inset 0 1px 0 rgba(184, 255, 245, .08);\n    padding: clamp(20px, 3vw, 35px) !important;\n}\n\n.cmc-page section h2 {\n    font-family: 'Space Grotesk', sans-serif;\n    font-size: clamp(23px, 2.6vw, 32px) !important;\n    letter-spacing: -.045em;\n    color: #f2fffd;\n}\n\n/* Search and status controls */\n.cmc-page input[type=\"search\"],\n.cmc-page select {\n    border-radius: 12px !important;\n    border: 1px solid #416375 !important;\n    background: #071522 !important;\n    color: #e7f8fa !important;\n    min-height: 46px;\n    transition: border-color .2s, box-shadow .2s;\n}\n\n.cmc-page input[type=\"search\"]:focus,\n.cmc-page select:focus {\n    outline: 2px solid #43e8cd;\n    outline-offset: 2px;\n    border-color: #43e8cd !important;\n}\n\n.cmc-page input::placeholder {\n    color: #849ba8;\n}\n\n.cmc-page section button {\n    transition:\n        filter .2s ease,\n        box-shadow .2s ease,\n        transform .2s ease;\n}\n\n.cmc-page section button:not(:disabled):hover {\n    filter: brightness(1.2);\n    transform: translateY(-2px);\n}\n\n.cmc-page section button:focus-visible {\n    outline: 2px solid #aeffed;\n    outline-offset: 3px;\n}\n\n/* Seats: selected semantics remain entirely data-driven */\n.cmc-page section button[aria-label*=\": Active\"] {\n    box-shadow:\n        0 0 0 1px rgba(45, 226, 197, .08),\n        inset 0 1px 0 rgba(173, 255, 242, .09);\n}\n\n.cmc-page section button[aria-label*=\": Active\"]:not(:disabled):hover {\n    box-shadow: 0 0 20px rgba(45, 226, 197, .25);\n}\n\n.cmc-page section button[aria-label*=\": Inactive\"] {\n    filter: saturate(.7);\n}\n\n.cmc-page section button:disabled {\n    cursor: not-allowed !important;\n}\n\n/* Extra breathing room for the seat matrix */\n.cmc-page section > div {\n    min-width: 0;\n}\n\n@media (max-width: 700px) {\n    .cmc-page {\n        padding: 16px 11px !important;\n    }\n\n    .cmc-page > div > div:first-child {\n        padding: 22px 18px;\n    }\n\n    .cmc-page > div > div:nth-child(2) {\n        grid-template-columns: repeat(\n            auto-fit, minmax(140px, 1fr)\n        ) !important;\n        gap: 10px !important;\n    }\n\n    .cmc-page > div > div:nth-child(2) > div {\n        padding: 20px !important;\n        min-height: 126px;\n    }\n\n    .cmc-page section {\n        padding: 18px 12px !important;\n    }\n}\n\n@media (prefers-reduced-motion: reduce) {\n    .cmc-page *,\n    .cmc-page *::before,\n    .cmc-page *::after {\n        transition: none !important;\n        animation: none !important;\n    }\n}\n"}</style>

            <main className="cmc-page" style={{
                minHeight: '100vh',
                background: '#070e19',
                color: '#f1f7fb',
                fontFamily: 'Inter, system-ui, sans-serif',
                padding: '32px 20px',
            }}>
                <div style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 16,
                        flexWrap: 'wrap',
                        marginBottom: 28,
                    }}>
                        <div>
                            <p style={{
                                color: '#34e2c4',
                                letterSpacing: 2,
                                fontSize: 11,
                                fontWeight: 800,
                            }}>
                                CINESIGHT / ADMINISTRATION
                            </p>

                            <h1 style={{
                                fontSize: 30,
                                fontWeight: 850,
                                margin: '6px 0',
                            }}>
                                CineSight Control Center
                            </h1>

                            <p style={{
                                color: '#9fb0c3',
                                fontSize: 13,
                            }}>
                                {studio.name} · Seat management
                            </p>
                        </div>

                        <a
                            href="/cinema"
                            style={{
                                color: '#062820',
                                background: '#34e2c4',
                                borderRadius: 10,
                                padding: '12px 18px',
                                fontWeight: 800,
                                textDecoration: 'none',
                            }}
                        >
                            View Simulator
                        </a>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(170px, 1fr))',
                        gap: 14,
                        marginBottom: 24,
                    }}>
                        {[
                            ['TOTAL SEATS', summary.total],
                            ['ACTIVE', summary.active],
                            ['INACTIVE', summary.inactive],
                        ].map(([label, value]) => (
                            <div key={label} style={panel}>
                                <div style={{
                                    fontSize: 11,
                                    color: '#95a8bb',
                                    letterSpacing: 1,
                                }}>
                                    {label}
                                </div>

                                <div style={{
                                    fontSize: 34,
                                    fontWeight: 850,
                                    marginTop: 8,
                                    color: label === 'ACTIVE'
                                        ? '#34e2c4'
                                        : '#ffffff',
                                }}>
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <ActivityHistoryPanel logs={auditLogs} />
                    <section style={panel}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 16,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                        }}>
                            <div>
                                <h2 style={{
                                    fontSize: 21,
                                    fontWeight: 800,
                                }}>
                                    Seat Management
                                </h2>
                                <p style={{
                                    color: '#9fb0c3',
                                    fontSize: 12,
                                    marginTop: 6,
                                }}>
                                    Click a seat to change its active status.
                                </p>
                            </div>

                            <span style={{
                                color: '#9fb0c3',
                                fontSize: 12,
                            }}>
                                Green: active · Gray: inactive
                            </span>
                        </div>

                        {error && (
                            <p role="alert" style={{
                                color: '#ff9e9e',
                                marginTop: 15,
                            }}>
                                {error}
                            </p>
                        )}


                        <div style={{
                            display: 'flex',
                            gap: 12,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            marginTop: 20,
                        }}>
                            <input
                                type="search"
                                aria-label="Search seats"
                                placeholder="Search seat: E9, A10, F..."
                                value={search}
                                onChange={event =>
                                    setSearch(event.target.value)
                                }
                                style={{
                                    flex: '1 1 230px',
                                    padding: '12px 14px',
                                    background: '#0a1421',
                                    border: '1px solid #395063',
                                    borderRadius: 9,
                                    color: '#ffffff',
                                    fontSize: 13,
                                }}
                            />

                            <select
                                aria-label="Filter seat status"
                                value={statusFilter}
                                onChange={event =>
                                    setStatusFilter(
                                        event.target.value as
                                        'all' | 'active' | 'inactive'
                                    )
                                }
                                style={{
                                    padding: '12px 14px',
                                    background: '#0a1421',
                                    border: '1px solid #395063',
                                    borderRadius: 9,
                                    color: '#ffffff',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="all">All Seats</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>


                            {/* CINESIGHT_BULK_ACTIVATE_V1 */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setStatusFilter('all');
                                }}
                                style={{
                                    padding: '12px 14px',
                                    background: '#233444',
                                    border: '1px solid #395063',
                                    borderRadius: 9,
                                    color: '#dce7f2',
                                    cursor: 'pointer',
                                }}
                            >
                                Reset Search & Filter
                            </button>

                            <button
                                type="button"
                                disabled={busy !== null || summary.inactive === 0}
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        'Activate ALL seats in this studio? ' +
                                        'This will change every inactive seat to ACTIVE.'
                                    );

                                    if (!confirmed) return;

                                    setError('');
                                    setBusy('ALL');

                                    router.post(
                                        '/cinema/admin/seats/activate-all',
                                        { confirmation: 'ACTIVATE_ALL' },
                                        {
                                            preserveScroll: true,
                                            onError: () => {
                                                setError(
                                                    'Failed to activate all seats.'
                                                );
                                            },
                                            onFinish: () => setBusy(null),
                                        }
                                    );
                                }}
                                style={{
                                    padding: '12px 14px',
                                    background: summary.inactive === 0
                                        ? '#243a39'
                                        : '#34e2c4',
                                    border: '1px solid #34e2c4',
                                    borderRadius: 9,
                                    color: summary.inactive === 0
                                        ? '#94b7ae'
                                        : '#062820',
                                    fontWeight: 800,
                                    cursor: summary.inactive === 0
                                        ? 'not-allowed'
                                        : 'pointer',
                                }}
                            >
                                {busy === 'ALL'
                                    ? 'Activating...'
                                    : 'Activate All Seats'}
                            </button>
                        </div>

                        <p role="status" style={{
                            color: '#9fb0c3',
                            fontSize: 12,
                            marginTop: 12,
                        }}>
                            Showing {visibleSeats.length} of {seats.length} seats
                        </p>

<div style={{
                            overflowX: 'auto',
                            marginTop: 24,
                            paddingBottom: 12,
                        }}>
                            <div style={{ minWidth: 760 }}>
                                {studio.rows
                                    .filter(row =>
                                        visibleSeats.some(seat =>
                                            seat.row === row
                                        )
                                    )
                                    .map(row => (
                                    <div
                                        key={row}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns:
                                                '34px repeat(18, minmax(32px, 1fr))',
                                            gap: 5,
                                            marginBottom: 8,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <strong style={{
                                            color: '#a8bbcb',
                                            fontSize: 12,
                                        }}>
                                            {row}
                                        </strong>

                                        {Array.from(
                                            { length: 18 },
                                            (_, index) => {
                                                const number = index + 1;

                                                const seat = visibleSeats.find(
                                                    item =>
                                                        item.row === row &&
                                                        item.number === number
                                                );

                                                if (!seat) {
                                                    return (
                                                        <div
                                                            key={number}
                                                            style={{
                                                                background: '#251a22',
                                                                height: 36,
                                                                borderRadius: 6,
                                                            }}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <button
                                                        key={seat.id}
                                                        type="button"
                                                        disabled={busy !== null}
                                                        aria-label={`${seat.id}: ${
                                                            seat.is_active
                                                                ? 'Active'
                                                                : 'Inactive'
                                                        }`}
                                                        title={`${seat.id} — click to ${
                                                            seat.is_active
                                                                ? 'deactivate'
                                                                : 'activate'
                                                        }`}
                                                        onClick={() =>
                                                            toggleSeat(seat)
                                                        }
                                                        style={{
                                                            height: 36,
                                                            borderRadius: 6,
                                                            border: seat.is_active
                                                                ? '1px solid #54e6cc'
                                                                : '1px solid #536070',
                                                            background: seat.is_active
                                                                ? '#174c49'
                                                                : '#303946',
                                                            color: seat.is_active
                                                                ? '#aaffef'
                                                                : '#b9c4ce',
                                                            fontSize: 11,
                                                            fontWeight: 800,
                                                            cursor: busy !== null
                                                                ? 'wait'
                                                                : 'pointer',
                                                            opacity: busy === seat.id
                                                                ? 0.45
                                                                : 1,
                                                        }}
                                                    >
                                                        {number}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p style={{
                            color: '#8da1b5',
                            fontSize: 12,
                            marginTop: 16,
                        }}>
                            Changes are saved to the CineSight database.
                            Refresh the simulator to see updated seat status.
                            Active does not mean available for booking.
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}
