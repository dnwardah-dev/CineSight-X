import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { getStudioSeats, type ApiSeat } from '@/lib/cinema/seatApi';
import {
    recommendSeats,
    type ViewingPreference,
} from '@/lib/cinema/seatRecommendation';
import { discoveryCSS } from './cinema-discover-styles';

type Zone = 'rear' | 'middle' | 'front';
type Priority = 'balanced' | 'center' | 'immersive';

const zones = [
    { id: 'rear', title: 'Rear', detail: 'Wider perspective', icon: '◫' },
    { id: 'middle', title: 'Middle', detail: 'Balanced distance', icon: '◎' },
    { id: 'front', title: 'Front', detail: 'Closer to action', icon: '▣' },
] as const;

const priorities = [
    { id: 'balanced', title: 'Balanced View', detail: 'Comfortable distance & alignment' },
    { id: 'center', title: 'Center Focus', detail: 'Stay aligned with the screen' },
    { id: 'immersive', title: 'Immersive', detail: 'Feel closer to the action' },
] as const;

const rowOptions: Record<Zone, string[]> = {
    rear: ['B', 'C'],
    middle: ['E', 'F'],
    front: ['H', 'I'],
};

const ROWS = 'ABCDEFGHIJ'.split('');
const SEAT_NUMBERS = Array.from({ length: 18 }, (_, i) => i + 1);

export default function CinemaDiscover() {
    const [zone, setZone] = useState<Zone>('middle');
    const [priority, setPriority] = useState<Priority>('balanced');


    const [apiSeats, setApiSeats] = useState<ApiSeat[] | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        getStudioSeats(controller.signal)
            .then((seats) => {
                setApiSeats(seats);
                setApiError(null);
            })
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setApiError(
                        error instanceof Error
                            ? error.message
                            : 'Seat database unavailable',
                    );
                    setApiSeats(null);
                }
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
            .filter((item) =>
                activeIds.has(item.seatId) &&
                rowOptions[zone].includes(item.seat.row)
            );

        if (priority === 'center') {
            ranked.sort((a, b) =>
                Math.abs(a.seat.number - 9.5) -
                    Math.abs(b.seat.number - 9.5) ||
                b.score - a.score ||
                a.seatId.localeCompare(b.seatId)
            );
        }

        return ranked.slice(0, 4);
    }, [zone, priority, apiSeats]);

    const candidates = recommendations.map((item) => item.seatId);

    const selectedZone = zones.find((item) => item.id === zone)!;
    const selectedPriority = priorities.find((item) => item.id === priority)!;

    function selectZone(value: Zone) {
        setZone(value);

    }

    function selectPriority(value: Priority) {
        setPriority(value);

    }

    return (
        <main className="sd-page">
            <style>{discoveryCSS}</style>
            <style>{"\n/* CINESIGHT_DISCOVERY_CINEMATIC_V1 */\n\n.sd-page {\n    position: relative;\n    isolation: isolate;\n    background:\n        radial-gradient(\n            ellipse 70% 45% at 84% 18%,\n            rgba(14, 120, 116, .19),\n            transparent 75%\n        ),\n        radial-gradient(\n            ellipse 60% 36% at 10% 65%,\n            rgba(31, 76, 125, .14),\n            transparent 75%\n        ),\n        #030a13;\n}\n\n.sd-page::before {\n    content: '';\n    position: fixed;\n    inset: 0;\n    z-index: -1;\n    pointer-events: none;\n    background-image:\n        radial-gradient(\n            rgba(99, 246, 225, .33) .7px,\n            transparent 1px\n        );\n    background-size: 48px 48px;\n    opacity: .19;\n    mask-image: linear-gradient(\n        110deg,\n        transparent 3%,\n        black 55%,\n        transparent 100%\n    );\n}\n\n.sd-navbar {\n    position: relative;\n    border-bottom-color: rgba(88, 237, 217, .2);\n}\n\n.sd-brand-icon {\n    box-shadow: 0 0 36px rgba(45, 226, 197, .2);\n}\n\n.sd-hero {\n    position: relative;\n    padding-top: clamp(44px, 5vw, 75px);\n    padding-bottom: 40px;\n}\n\n.sd-hero h1 {\n    font-size: clamp(40px, 5.6vw, 78px);\n    line-height: 1.02;\n    letter-spacing: -.065em;\n    max-width: 1130px;\n    text-wrap: balance;\n    text-shadow: 0 15px 52px rgba(0, 0, 0, .42);\n}\n\n.sd-hero h1 span {\n    background: linear-gradient(\n        105deg,\n        #aaffef,\n        #2de2c5 52%,\n        #7bd9f5\n    );\n    -webkit-background-clip: text;\n    background-clip: text;\n    color: transparent;\n}\n\n.sd-progress {\n    background: rgba(9, 25, 37, .62);\n    border: 1px solid rgba(77, 179, 170, .2);\n    border-radius: 999px;\n    padding: 13px 19px;\n    width: fit-content;\n    max-width: 100%;\n}\n\n.sd-main-panel,\n.sd-preview-panel {\n    position: relative;\n    border-color: rgba(70, 166, 161, .32);\n    background: linear-gradient(\n        155deg,\n        rgba(18, 37, 51, .97),\n        rgba(8, 19, 32, .98)\n    );\n    box-shadow:\n        0 30px 85px rgba(0, 0, 0, .3),\n        inset 0 1px 0 rgba(206, 255, 250, .045);\n}\n\n.sd-main-panel::before,\n.sd-preview-panel::before {\n    content: '';\n    position: absolute;\n    inset: -1px;\n    border-radius: inherit;\n    pointer-events: none;\n    background: linear-gradient(\n        135deg,\n        rgba(45, 226, 197, .22),\n        transparent 24%,\n        transparent 75%,\n        rgba(45, 226, 197, .1)\n    );\n    mask:\n        linear-gradient(#000 0 0) content-box,\n        linear-gradient(#000 0 0);\n    mask-composite: exclude;\n    padding: 1px;\n}\n\n.sd-panel-heading h2,\n.sd-preview-top h2 {\n    font-size: clamp(23px, 2.1vw, 31px);\n}\n\n.sd-zone-card {\n    min-height: 141px;\n    position: relative;\n    overflow: hidden;\n    background: linear-gradient(145deg, #0c1c2b, #071320);\n    transition:\n        border-color .25s ease,\n        background .25s ease,\n        transform .25s ease,\n        box-shadow .25s ease;\n}\n\n.sd-zone-card::after {\n    content: '';\n    position: absolute;\n    width: 125px;\n    height: 125px;\n    top: -75px;\n    left: -75px;\n    pointer-events: none;\n    background: rgba(45, 226, 197, .2);\n    filter: blur(44px);\n    opacity: 0;\n    transition: opacity .3s;\n}\n\n.sd-zone-card:hover::after,\n.sd-zone-card.sd-selected::after {\n    opacity: 1;\n}\n\n.sd-zone-card.sd-selected {\n    background: linear-gradient(\n        140deg,\n        #10443e,\n        #092921\n    );\n    box-shadow:\n        0 0 0 1px rgba(45, 226, 197, .13),\n        inset 0 0 33px rgba(45, 226, 197, .065),\n        0 12px 28px rgba(0, 0, 0, .18);\n}\n\n.sd-zone-symbol {\n    font-size: 28px;\n    text-shadow: 0 0 22px rgba(45, 226, 197, .3);\n}\n\n.sd-priority-card {\n    min-height: 76px;\n    transition:\n        background .25s ease,\n        border-color .25s ease,\n        transform .25s ease,\n        box-shadow .25s ease;\n}\n\n.sd-priority-card.sd-selected {\n    background: linear-gradient(\n        90deg,\n        rgba(19, 84, 71, .73),\n        rgba(9, 36, 36, .94)\n    );\n    box-shadow: inset 3px 0 0 #2de2c5;\n}\n\n.sd-submit {\n    position: relative;\n    overflow: hidden;\n    background: linear-gradient(\n        105deg,\n        #25d7bb,\n        #75f8df\n    );\n    box-shadow: 0 15px 45px rgba(31, 205, 177, .16);\n    transition: transform .25s, box-shadow .25s;\n}\n\n.sd-submit:not(:disabled):hover {\n    transform: translateY(-3px);\n    box-shadow: 0 22px 52px rgba(31, 205, 177, .35);\n}\n\n.sd-submit:disabled {\n    opacity: .5;\n    cursor: not-allowed;\n}\n\n.sd-studio-graphic {\n    isolation: isolate;\n    position: relative;\n    background:\n        radial-gradient(\n            ellipse at 50% 0%,\n            rgba(50, 160, 172, .34),\n            transparent 62%\n        ),\n        linear-gradient(180deg, #0b2634, #04101b 90%);\n    box-shadow: inset 0 0 70px rgba(0, 0, 0, .3);\n}\n\n.sd-studio-graphic::after {\n    content: '';\n    position: absolute;\n    z-index: 0;\n    inset: 0;\n    pointer-events: none;\n    opacity: .32;\n    background: linear-gradient(\n        180deg,\n        transparent 0%,\n        rgba(68, 239, 224, .11) 49%,\n        transparent 55%\n    );\n    transform: translateY(-100%);\n    animation: sd-cinematic-scan 9s linear infinite;\n}\n\n.sd-studio-graphic > * {\n    position: relative;\n    z-index: 1;\n}\n\n.sd-screen {\n    border: 1px solid rgba(223, 255, 255, .8);\n    box-shadow:\n        0 0 42px rgba(79, 218, 225, .28),\n        0 20px 75px rgba(79, 218, 225, .12);\n}\n\n.sd-match-seat {\n    box-shadow: 0 0 12px rgba(45, 226, 197, .6);\n    animation: sd-seat-pulse 3s ease-in-out infinite;\n}\n\n.sd-preview-footer strong {\n    color: #eafffb;\n}\n\n.sd-page a:focus-visible,\n.sd-page button:focus-visible {\n    outline: 3px solid #b5fff1;\n    outline-offset: 4px;\n}\n\n@keyframes sd-cinematic-scan {\n    from { transform: translateY(-100%); }\n    to { transform: translateY(100%); }\n}\n\n@keyframes sd-seat-pulse {\n    0%, 100% {\n        box-shadow: 0 0 6px rgba(45, 226, 197, .4);\n    }\n    50% {\n        box-shadow: 0 0 19px rgba(45, 226, 197, .9);\n    }\n}\n\n@media (max-width: 900px) {\n    .sd-hero {\n        padding-top: 40px;\n    }\n\n    .sd-main-panel,\n    .sd-preview-panel {\n        box-shadow: 0 18px 48px rgba(0, 0, 0, .25);\n    }\n}\n\n@media (max-width: 600px) {\n    .sd-hero h1 {\n        font-size: clamp(34px, 9.4vw, 48px);\n    }\n\n    .sd-progress {\n        padding: 10px 12px;\n        border-radius: 14px;\n    }\n\n    .sd-zone-card {\n        min-height: 116px;\n    }\n\n    .sd-panel-heading h2,\n    .sd-preview-top h2 {\n        font-size: 22px;\n    }\n}\n\n@media (prefers-reduced-motion: reduce) {\n    .sd-studio-graphic::after,\n    .sd-match-seat {\n        animation: none !important;\n    }\n\n    .sd-zone-card,\n    .sd-priority-card,\n    .sd-submit {\n        transition: none !important;\n    }\n}\n"}</style>
            <Head title="Seat Discovery | CineSight-X" />

                        <style>{"\n/* CINESIGHT_HOLOGRAPHIC_LAB_V1 */\n\n/* Dark cinematic environment */\n.sd-page {\n    background:\n        radial-gradient(\n            ellipse 60% 40% at 79% 36%,\n            rgba(0, 183, 167, .16),\n            transparent 76%\n        ),\n        radial-gradient(\n            ellipse 40% 32% at 5% 78%,\n            rgba(24, 83, 152, .13),\n            transparent 80%\n        ),\n        #030914;\n}\n\n/* Studio gets more visual importance */\n.sd-layout {\n    grid-template-columns:\n        minmax(0, .84fr)\n        minmax(0, 1.16fr);\n    gap: 22px;\n    align-items: stretch;\n}\n\n.sd-main-panel,\n.sd-preview-panel {\n    border-radius: 24px;\n    background:\n        linear-gradient(\n            147deg,\n            rgba(17, 39, 55, .96),\n            rgba(4, 16, 29, .98)\n        );\n    border: 1px solid rgba(66, 207, 190, .26);\n    box-shadow:\n        0 30px 90px rgba(0, 0, 0, .28),\n        inset 0 1px 0 rgba(173, 255, 242, .09);\n}\n\n.sd-preview-panel {\n    overflow: hidden;\n    background:\n        radial-gradient(\n            ellipse 90% 48% at 50% 44%,\n            rgba(17, 117, 124, .19),\n            transparent 84%\n        ),\n        linear-gradient(145deg, #102638, #061320);\n}\n\n.sd-preview-top {\n    position: relative;\n    z-index: 2;\n}\n\n.sd-preview-top h2 {\n    font-size: clamp(25px, 2.25vw, 34px);\n    line-height: 1.1;\n}\n\n/* Technical profile */\n.sd-summary > div {\n    background: rgba(4, 17, 28, .7);\n    border: 1px solid rgba(78, 196, 183, .28);\n    border-radius: 13px;\n    backdrop-filter: blur(10px);\n}\n\n.sd-summary strong {\n    color: #eafffc;\n}\n\n/* Holographic analysis chamber */\n.sd-studio-graphic {\n    position: relative;\n    isolation: isolate;\n    overflow: hidden;\n    min-height: 540px;\n    margin-top: 22px;\n    padding: 46px 23px 27px;\n    border-radius: 20px;\n    border: 1px solid rgba(78, 242, 220, .48);\n    background:\n        radial-gradient(\n            ellipse 55% 30% at 50% 13%,\n            rgba(104, 226, 241, .22),\n            transparent 90%\n        ),\n        radial-gradient(\n            ellipse 75% 70% at 50% 57%,\n            rgba(14, 112, 121, .32),\n            transparent 88%\n        ),\n        linear-gradient(180deg, #092638, #03101c 82%);\n    box-shadow:\n        inset 0 0 85px rgba(9, 166, 151, .08),\n        0 20px 65px rgba(0, 0, 0, .3);\n}\n\n/* Framing beams behind the seat map */\n.sd-studio-graphic::before {\n    content: '';\n    position: absolute;\n    inset: 12px;\n    z-index: 0;\n    pointer-events: none;\n    border: 1px solid rgba(76, 237, 218, .13);\n    border-radius: 12px;\n    background:\n        linear-gradient(\n            90deg,\n            transparent 49.9%,\n            rgba(87, 249, 229, .09) 50%,\n            transparent 50.1%\n        ),\n        repeating-linear-gradient(\n            0deg,\n            transparent 0 35px,\n            rgba(61, 181, 175, .045) 36px\n        );\n}\n\n.sd-studio-graphic > * {\n    position: relative;\n    z-index: 1;\n}\n\n/* Floating screen projection */\n.sd-screen-glow {\n    height: 60px;\n    margin-bottom: -47px;\n    opacity: .8;\n    filter: blur(29px);\n    background: #6dedf5;\n}\n\n.sd-screen {\n    max-width: 79%;\n    min-height: 54px;\n    display: grid;\n    place-items: center;\n    transform: perspective(650px) rotateX(-8deg);\n    background: linear-gradient(\n        180deg,\n        #dcffff 0%,\n        #91c9d4 60%,\n        #477d91 100%\n    );\n    color: #18394a;\n    letter-spacing: 3px;\n    border: 1px solid rgba(229, 255, 255, .85);\n    box-shadow:\n        0 0 25px rgba(150, 244, 249, .56),\n        0 0 100px rgba(54, 220, 219, .23);\n}\n\n.sd-screen-label {\n    color: #70c5cb;\n    font-size: 10px;\n    letter-spacing: 2.4px;\n    margin-top: 18px;\n    margin-bottom: 31px;\n}\n\n/* Perspective seating */\n.sd-seat-map {\n    width: 100%;\n    max-width: 540px;\n    gap: 9px;\n    padding: 10px 0 16px;\n    transform:\n        perspective(950px)\n        rotateX(23deg);\n    transform-origin: top center;\n    filter: drop-shadow(0 12px 14px rgba(0,0,0,.25));\n}\n\n.sd-seat-row {\n    gap: 8px;\n}\n\n.sd-seat-cells {\n    gap: 4px;\n}\n\n.sd-row-label {\n    color: #9fd8d9;\n    font-size: 10px;\n    width: 14px;\n}\n\n.sd-mini-seat {\n    aspect-ratio: 1 / .82;\n    border-radius: 4px 4px 2px 2px;\n    background: linear-gradient(\n        180deg,\n        #326879,\n        #204352\n    );\n    border-top: 1px solid rgba(141, 231, 236, .18);\n    box-shadow: 0 2px 0 rgba(2, 9, 18, .7);\n    transition:\n        background .3s ease,\n        box-shadow .3s ease,\n        transform .3s ease;\n}\n\n.sd-zone-seat {\n    background: linear-gradient(\n        180deg,\n        #327f77,\n        #205951\n    );\n}\n\n.sd-match-seat {\n    position: relative;\n    background: linear-gradient(\n        180deg,\n        #aafff0,\n        #25e6c8\n    );\n    border-color: #ddfff8;\n    box-shadow:\n        0 0 14px rgba(45, 226, 197, .7),\n        0 3px 0 rgba(10, 92, 86, .9);\n    transform: translateY(-2px);\n    animation: none;\n}\n\n/* Studio status and metric readouts */\n.sd-map-legend {\n    margin-top: 25px;\n    font-size: 11px;\n    color: #b5d2d9;\n}\n\n.sd-preview-footer {\n    margin-top: 24px;\n    padding-top: 26px;\n    border-top: 1px solid rgba(90, 212, 204, .24);\n}\n\n.sd-preview-footer strong {\n    font-size: 30px;\n    color: #eafffa;\n}\n\n.sd-live-label {\n    border: 1px solid rgba(74, 239, 206, .35);\n    background: rgba(13, 88, 74, .5);\n    box-shadow: 0 0 24px rgba(45, 226, 197, .12);\n}\n\n/* Control panel: intentional, not generic form UI */\n.sd-zone-card {\n    border-radius: 15px;\n    min-height: 133px;\n}\n\n.sd-zone-card.sd-selected {\n    border: 1px solid #42f3d5;\n    box-shadow:\n        0 0 28px rgba(32, 227, 197, .09),\n        inset 0 0 25px rgba(45, 226, 197, .045);\n}\n\n.sd-priority-card {\n    border-radius: 13px;\n}\n\n.sd-priority-card.sd-selected {\n    border-color: #47edce;\n    box-shadow:\n        inset 3px 0 #2de2c5,\n        0 0 22px rgba(45, 226, 197, .07);\n}\n\n.sd-submit:not(:disabled) {\n    box-shadow: 0 18px 42px rgba(31, 209, 182, .18);\n}\n\n@keyframes sd-holo-match {\n    0%, 100% {\n        filter: brightness(1);\n        box-shadow: 0 0 9px rgba(45, 226, 197, .55);\n    }\n    50% {\n        filter: brightness(1.28);\n        box-shadow: 0 0 24px rgba(45, 226, 197, .92);\n    }\n}\n\n@media (max-width: 1000px) {\n    .sd-layout {\n        grid-template-columns: 1fr;\n    }\n\n    .sd-studio-graphic {\n        min-height: 430px;\n    }\n\n    .sd-seat-map {\n        max-width: 540px;\n    }\n}\n\n@media (max-width: 600px) {\n    .sd-studio-graphic {\n        padding: 26px 11px 20px;\n        min-height: auto;\n        border-radius: 14px;\n    }\n\n    .sd-screen {\n        min-height: 37px;\n        letter-spacing: 1.5px;\n        font-size: 8px;\n    }\n\n    .sd-seat-map {\n        transform: none;\n        gap: 5px;\n        padding: 0 0 10px;\n    }\n\n    .sd-seat-row {\n        gap: 4px;\n    }\n\n    .sd-seat-cells {\n        gap: 2px;\n    }\n\n    .sd-mini-seat {\n        border-radius: 2px 2px 1px 1px;\n    }\n\n    .sd-zone-card {\n        min-height: 112px;\n    }\n\n    .sd-preview-footer strong {\n        font-size: 25px;\n    }\n}\n\n@media (prefers-reduced-motion: reduce) {\n    .sd-match-seat {\n        animation: none !important;\n    }\n\n    .sd-mini-seat {\n        transition: none !important;\n    }\n}\n"}</style>
            <div className="sd-shell">
                <header className="sd-navbar">
                    <a href="/cinema" className="sd-brand">
                        <span className="sd-brand-icon">◈</span>
                        CineSight <span>X</span>
                    </a>

                    <div className="sd-nav-right">
                        <span className="sd-nav-status">
                            <span className="sd-status-dot" />
                            DISCOVERY ENGINE
                        </span>
                        <a href="/cinema" className="sd-back">
                            ← Home
                        </a>
                    </div>
                </header>

                <section className="sd-hero">
                    <div className="sd-eyebrow">
                        <span className="sd-eyebrow-line" />
                        CINESIGHT-X / PERSONALIZED DISCOVERY
                    </div>

                    <h1>
                        Your Perfect Seat.
                        <span> Found Smarter.</span>
                    </h1>

                    <p>
                        Less guessing, better viewing. Tell us your preferences
                        and explore seats that match your cinema style.
                    </p>

                    <div className="sd-progress">
                        <span className="sd-progress-active">01 &nbsp; Preferences</span>
                        <span className="sd-progress-divider">/</span>
                        <span>02 &nbsp; Recommendations</span>
                        <span className="sd-progress-divider">/</span>
                        <span>03 &nbsp; Cinema POV</span>
                    </div>
                </section>

                <div className="sd-layout">
                    <section className="sd-main-panel">
                        <div className="sd-panel-heading">
                            <div>
                                <div className="sd-kicker">STEP 01 / PERSONALIZE</div>
                                <h2>Make It Your View.</h2>
                                <p>Two quick choices. A smarter starting point.</p>
                            </div>
                            <div className="sd-step-counter">01 / 02</div>
                        </div>

                        <div className="sd-field">
                            <div className="sd-field-title">
                                <span className="sd-field-number">01</span>
                                <div>
                                    <h3>Where do you like to sit?</h3>
                                    <p>Choose your preferred viewing zone.</p>
                                </div>
                            </div>

                            <div className="sd-zone-grid">
                                {zones.map((item) => (
                                    <button
                                        type="button"
                                        key={item.id}
                                        onClick={() => selectZone(item.id)}
                                        aria-pressed={zone === item.id}
                                        className={`sd-zone-card ${zone === item.id ? 'sd-selected' : ''}`}
                                    >
                                        <span className="sd-choice-check">
                                            {zone === item.id ? '✓' : ''}
                                        </span>
                                        <span className="sd-zone-symbol">{item.icon}</span>
                                        <strong>{item.title}</strong>
                                        <small>{item.detail}</small>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sd-field sd-second-field">
                            <div className="sd-field-title">
                                <span className="sd-field-number">02</span>
                                <div>
                                    <h3>What matters most to you?</h3>
                                    <p>Set your main viewing priority.</p>
                                </div>
                            </div>

                            <div className="sd-priority-list">
                                {priorities.map((item) => (
                                    <button
                                        type="button"
                                        key={item.id}
                                        onClick={() => selectPriority(item.id)}
                                        aria-pressed={priority === item.id}
                                        className={`sd-priority-card ${priority === item.id ? 'sd-selected' : ''}`}
                                    >
                                        <span className="sd-radio">
                                            {priority === item.id && <span />}
                                        </span>
                                        <span className="sd-priority-copy">
                                            <strong>{item.title}</strong>
                                            <small>{item.detail}</small>
                                        </span>
                                        <span className="sd-priority-arrow">↗</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className="sd-submit"
                            type="button"
                            onClick={() => {
        window.location.assign(
            '/cinema/results?zone=' +
            encodeURIComponent(zone) +
            '&priority=' +
            encodeURIComponent(priority)
        );
    }}
                            disabled={!apiSeats || candidates.length === 0}
                        >
                            <span>Discover My Seats</span>
                            <span>→</span>
                        </button>

                        <p className="sd-disclaimer">
                            Personalized estimates based on seat position.
                            Not a guarantee of real-world viewing comfort.
                        </p>
                    </section>

                    <aside className="sd-preview-panel">
                        <div className="sd-preview-top">
                            <div>
                                <div className="sd-kicker">LIVE PREFERENCE PREVIEW</div>
                                <h2>Your Viewing Profile</h2>
                            </div>
                            <span className="sd-live-label">● LIVE</span>
                        </div>

                        <p role="status" style={{
                            color: apiError ? '#ff9b9b' : '#2de2c5',
                            fontSize: 12,
                            marginTop: 18,
                        }}>
                            {apiError
                                ? 'Database unavailable: ' + apiError
                                : apiSeats
                                    ? 'Database connected - ' +
                                      apiSeats.filter((s) => s.is_active).length +
                                      ' active seats'
                                    : 'Connecting to seat database...'}
                        </p>
                        <div className="sd-summary">
                            <div>
                                <small>PREFERRED ZONE</small>
                                <strong>{selectedZone.title} Rows</strong>
                            </div>
                            <div>
                                <small>VIEWING STYLE</small>
                                <strong>{selectedPriority.title}</strong>
                            </div>
                        </div>

                        <div className="sd-studio-graphic">
                            <div className="sd-screen-glow" />
                            <div className="sd-screen">CINEMA SCREEN</div>
                            <div className="sd-screen-label">SCREEN DIRECTION</div>

                            <div className="sd-seat-map">
                                {[...ROWS].reverse().map((row) => (
                                    <div className="sd-seat-row" key={row}>
                                        <span className="sd-row-label">{row}</span>
                                        <div className="sd-seat-cells">
                                            {SEAT_NUMBERS.map((number) => {
                                                const id = `${row}${number}`;
                                                const matched = candidates.includes(id);
                                                const zoneRow = rowOptions[zone].includes(row);

                                                return (
                                                    <span
                                                        key={id}
                                                        className={
                                                            matched
                                                                ? 'sd-mini-seat sd-match-seat'
                                                                : zoneRow
                                                                  ? 'sd-mini-seat sd-zone-seat'
                                                                  : 'sd-mini-seat'
                                                        }
                                                        title={`Seat ${id}${matched ? ' - suggested' : ''}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="sd-map-legend">
                                <span><i className="sd-legend-match" /> Suggested</span>
                                <span><i className="sd-legend-zone" /> Preferred zone</span>
                            </div>
                        </div>

                        <div className="sd-preview-footer">
                            <div>
                                <strong>180</strong>
                                <span>SEATS</span>
                            </div>
                            <div>
                                <strong>10</strong>
                                <span>ROWS</span>
                            </div>
                            <div>
                                <strong>4</strong>
                                <span>CANDIDATES</span>
                            </div>
                        </div>
                    </aside>
                </div>

            </div>
        </main>
    );
}
