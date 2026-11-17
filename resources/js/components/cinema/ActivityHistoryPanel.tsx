import { useEffect, useState } from 'react';
import './activity-history-chronicle.css';
import type { CSSProperties } from 'react';

export type ActivityLog = {
    id: number;
    action: string;
    admin_name: string;
    seat_label: string | null;
    old_status: boolean | null;
    new_status: boolean | null;
    affected_seats: number;
    created_at: string | null;
};

type Props = {
    logs: ActivityLog[];
};

type Filter = 'ALL' | 'SEAT_STATUS_CHANGED' | 'ACTIVATE_ALL';

type HistoryResponse = {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

const panelStyle: CSSProperties = {
    background: '#111c2b',
    border: '1px solid #2b4050',
    borderRadius: 18,
    padding: 22,
    marginBottom: 24,
};

const controlStyle: CSSProperties = {
    background: '#0b1724',
    border: '1px solid #395063',
    borderRadius: 9,
    padding: '12px 14px',
    color: '#f1f7fb',
    fontSize: 13,
};

const buttonStyle: CSSProperties = {
    ...controlStyle,
    background: '#233444',
    cursor: 'pointer',
};

function statusLabel(value: boolean | null): string {
    if (value === null) return 'UNKNOWN';
    return value ? 'ACTIVE' : 'INACTIVE';
}


function makeExportUrl(
    format: 'csv' | 'pdf',
    search: string,
    filter: 'ALL' | 'SEAT_STATUS_CHANGED' | 'ACTIVATE_ALL'
): string {
    const params = new URLSearchParams();

    if (search.trim()) {
        params.set('search', search.trim());
    }

    if (filter !== 'ALL') {
        params.set('action', filter);
    }

    const endpoint = format === 'pdf'
        ? '/cinema/admin/activity-history/export-pdf'
        : '/cinema/admin/activity-history/export';

    const query = params.toString();

    return query ? endpoint + '?' + query : endpoint;
}

export default function ActivityHistoryPanel({ logs }: Props) {
    // CINESIGHT_SERVER_PAGINATION_V1
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<Filter>('ALL');
    const [page, setPage] = useState(1);

    const [result, setResult] = useState<HistoryResponse>({
        data: logs.slice(0, 10),
        current_page: 1,
        last_page: Math.max(1, Math.ceil(logs.length / 10)),
        per_page: 10,
        total: logs.length,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        // Search requests are debounced to avoid unnecessary API calls.
        const timer = window.setTimeout(async () => {
            try {
                setLoading(true);
                setError('');

                const params = new URLSearchParams();
                params.set('page', String(page));

                if (search.trim()) {
                    params.set('search', search.trim());
                }

                if (filter !== 'ALL') {
                    params.set('action', filter);
                }

                const response = await fetch(
                    '/cinema/admin/activity-history?' + params.toString(),
                    {
                        method: 'GET',
                        credentials: 'same-origin',
                        headers: {
                            Accept: 'application/json',
                        },
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        'Unable to load activity history (' +
                        response.status + ').'
                    );
                }

                const data: HistoryResponse = await response.json();

                if (!controller.signal.aborted) {
                    setResult(data);
                }
            } catch (err) {
                if (controller.signal.aborted) return;

                setError(
                    err instanceof Error
                        ? err.message
                        : 'Unable to load activity history.'
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }, search ? 300 : 0);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [search, filter, page, logs]);

    const changeSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const changeFilter = (value: Filter) => {
        setFilter(value);
        setPage(1);
    };

    const resetFilters = () => {
        setSearch('');
        setFilter('ALL');
        setPage(1);
    };

    const currentPage = result.current_page;
    const lastPage = result.last_page;
    const from = result.total === 0
        ? 0
        : (currentPage - 1) * result.per_page + 1;

    const to = Math.min(
        currentPage * result.per_page,
        result.total
    );

    return (
        <section className="cac-audit" style={panelStyle} aria-label="Admin Activity History">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 18,
            }}>
                <div>
                    <p style={{
                        fontSize: 11,
                        color: '#34e2c4',
                        letterSpacing: 2,
                        fontWeight: 800,
                        marginBottom: 6,
                    }}>
                        ADMIN ACTIVITY
                    </p>
                    <h2 style={{
                        fontSize: 21,
                        fontWeight: 800,
                        margin: 0,
                    }}>
                        Activity History
                    </h2>
                </div>

                <span style={{ color: '#95a8bb', fontSize: 12 }}>
                    {result.total} total records
                </span>
            </div>

            <div style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
                marginBottom: 12,
            }}>
                <input
                    type="search"
                    aria-label="Search activity history"
                    placeholder="Search activity: E10, C2, admin..."
                    value={search}
                    onChange={event => changeSearch(event.target.value)}
                    style={{
                        ...controlStyle,
                        flex: '1 1 240px',
                        minWidth: 0,
                    }}
                />

                <select
                    aria-label="Filter activity type"
                    value={filter}
                    onChange={event =>
                        changeFilter(event.target.value as Filter)
                    }
                    style={{
                        ...controlStyle,
                        flex: '0 1 210px',
                    }}
                >
                    <option value="ALL">All Activities</option>
                    <option value="SEAT_STATUS_CHANGED">
                        Seat Status Changed
                    </option>
                    <option value="ACTIVATE_ALL">
                        Activate All Seats
                    </option>
                </select>

                <button
                    type="button"
                    onClick={resetFilters}
                    style={buttonStyle}
                >
                    Reset
                </button>
            </div>


            {/* CINESIGHT_EXPORT_BUTTONS_V2 */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 18,
            }}>
                <a
                    href={makeExportUrl('csv', search, filter)}
                    download
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 20px',
                        borderRadius: 9,
                        background: '#103d37',
                        border: '1px solid #34d9b3',
                        color: '#72f4d7',
                        fontSize: 13,
                        fontWeight: 800,
                        textDecoration: 'none',
                    }}
                >
                    Export CSV
                </a>

                <a
                    href={makeExportUrl('pdf', search, filter)}
                    download
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 20px',
                        borderRadius: 9,
                        background: '#20374e',
                        border: '1px solid #6585a5',
                        color: '#e4f0ff',
                        fontSize: 13,
                        fontWeight: 800,
                        textDecoration: 'none',
                    }}
                >
                    Export PDF
                </a>

                <span style={{
                    color: '#8ea7bb',
                    fontSize: 11,
                }}>
                    Exports follow active Search & Filter
                </span>
            </div>

<p role="status" style={{
                color: '#95a8bb',
                fontSize: 12,
                marginBottom: 16,
            }}>
                {loading
                    ? 'Loading activity history...'
                    : 'Showing ' + from + '-' + to +
                      ' of ' + result.total + ' records'}
            </p>

            {error && (
                <p role="alert" style={{
                    color: '#ffaaa5',
                    fontSize: 13,
                    marginBottom: 14,
                }}>
                    {error}
                </p>
            )}

            {!error && !loading && result.data.length === 0 && (
                <p style={{
                    color: '#95a8bb',
                    fontSize: 13,
                    padding: '16px 0',
                }}>
                    No matching activity found.
                </p>
            )}

            {!error && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    opacity: loading ? 0.55 : 1,
                }}>
                    {result.data.map(log => (
                        <article
                            key={log.id}
                            className={
                                log.action === 'ACTIVATE_ALL'
                                    ? 'cac-event cac-bulk'
                                    : 'cac-event'
                            }
                            style={{
                            padding: 15,
                            background: '#0b1724',
                            border: '1px solid #2b4050',
                            borderRadius: 11,
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 12,
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 7,
                            }}>
                                <strong style={{
                                    fontSize: 14,
                                    color: '#f1f7fb',
                                }}>
                                    {log.action === 'ACTIVATE_ALL'
                                        ? 'Activate All Seats'
                                        : 'Seat ' + (log.seat_label ?? 'Unknown')}
                                </strong>

                                <span style={{
                                    color: '#b5c8d8',
                                    fontSize: 12,
                                }}>
                                    {statusLabel(log.old_status)}
                                    {' \u2192 '}
                                    {statusLabel(log.new_status)}
                                </span>

                                <span style={{
                                    color: '#8ca3b7',
                                    fontSize: 11,
                                }}>
                                    By {log.admin_name}
                                    {' \u00B7 '}
                                    {log.affected_seats} seat(s) affected
                                </span>
                            </div>

                            <time
                                dateTime={log.created_at ?? undefined}
                                style={{
                                    color: '#91a5b7',
                                    fontSize: 11,
                                    textAlign: 'right',
                                }}
                            >
                                {log.created_at
                                    ? new Date(log.created_at)
                                        .toLocaleString('id-ID', {
                                            timeZone: 'Asia/Jakarta',
                                        })
                                    : 'Time unavailable'}
                            </time>
                        </article>
                    ))}
                </div>
            )}

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 22,
                paddingTop: 16,
                borderTop: '1px solid #2b4050',
            }}>
                <button
                    type="button"
                    disabled={loading || error !== '' || currentPage <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    style={{
                        ...buttonStyle,
                        opacity: loading || error || currentPage <= 1
                            ? 0.45
                            : 1,
                    }}
                >
                    Previous
                </button>

                <span style={{
                    fontSize: 12,
                    color: '#a8bbcb',
                }}>
                    Page {currentPage} of {lastPage}
                </span>

                <button
                    type="button"
                    disabled={
                        loading ||
                        error !== '' ||
                        currentPage >= lastPage
                    }
                    onClick={() => setPage(p => p + 1)}
                    style={{
                        ...buttonStyle,
                        opacity: loading || error || currentPage >= lastPage
                            ? 0.45
                            : 1,
                    }}
                >
                    Next
                </button>
            </div>
        </section>
    );
}
