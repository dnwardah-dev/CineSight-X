import { Head } from '@inertiajs/react';
import './cinema-experience-fonts.css';
import CinemaScene from '@/components/cinema/CinemaScene';

export default function CinemaExperience() {
    return (
        <main className="cxe-page">
            <Head title="CineSight-X | Immersive Dimension" />

            <style>{`
                .cxe-page {
                    --cxe-mint: #31e7cd;
                    --cxe-ink: #040a12;
                    min-height: 100vh;
                    background:
                        radial-gradient(ellipse 60% 32% at 50% 2%, #135a6040, transparent 80%),
                        radial-gradient(ellipse 38% 35% at 100% 55%, #17447d30, transparent),
                        var(--cxe-ink);
                    color: #f4fbff;
                    font-family: 'Inter', system-ui, sans-serif;
                    position: relative;
                    isolation: isolate;
                }

                .cxe-page *,
                .cxe-page *::before,
                .cxe-page *::after {
                    box-sizing: border-box;
                }

                .cxe-page::before {
                    content: '';
                    position: absolute;
                    inset: 0 0 auto;
                    height: 860px;
                    z-index: -1;
                    pointer-events: none;
                    background-image:
                        linear-gradient(#7df7e908 1px, transparent 1px),
                        linear-gradient(90deg, #7df7e908 1px, transparent 1px);
                    background-size: 68px 68px;
                    mask-image: linear-gradient(
                        to bottom, #0003, #000, transparent
                    );
                }

                .cxe-shell {
                    width: min(1500px, calc(100% - 64px));
                    margin: 0 auto;
                }

                .cxe-nav {
                    border-bottom: 1px solid #87f8e61c;
                    background: #030b14d9;
                    backdrop-filter: blur(18px);
                }

                .cxe-nav-inner {
                    min-height: 83px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 22px;
                }

                .cxe-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    color: #f5fffd;
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 22px;
                    font-weight: 700;
                    letter-spacing: -1px;
                    text-decoration: none;
                }

                .cxe-brand-mark {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: grid;
                    place-items: center;
                    color: #05221c;
                    background: var(--cxe-mint);
                    box-shadow: 0 0 32px #31e7cd35;
                    font-size: 25px;
                }

                .cxe-brand b {
                    color: var(--cxe-mint);
                }

                .cxe-nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                }

                .cxe-nav-status {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1.8px;
                    color: #77dccd;
                }

                .cxe-nav-dot {
                    width: 7px;
                    height: 7px;
                    flex: none;
                    border-radius: 50%;
                    background: var(--cxe-mint);
                    box-shadow: 0 0 15px var(--cxe-mint);
                }

                .cxe-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    border: 1px solid #38545e;
                    border-radius: 999px;
                    padding: 11px 18px;
                    color: #d5e9ed;
                    font-size: 12px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: border-color .2s, color .2s;
                }

                .cxe-back:hover {
                    color: var(--cxe-mint);
                    border-color: var(--cxe-mint);
                }

                .cxe-intro {
                    padding: clamp(28px, 3.5vw, 52px) 0 24px;
                    position: relative;
                }

                .cxe-eyebrow {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--cxe-mint);
                    font-size: 10px;
                    letter-spacing: 2.5px;
                    font-weight: 800;
                }

                .cxe-eyebrow::before {
                    content: '';
                    width: 29px;
                    height: 1px;
                    background: var(--cxe-mint);
                    box-shadow: 0 0 12px var(--cxe-mint);
                }

                .cxe-intro-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1.12fr) minmax(0, .88fr);
                    gap: 28px;
                    align-items: center;
                }

                .cxe-title {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: clamp(43px, 5vw, 76px);
                    font-weight: 700;
                    line-height: 1.04;
                    letter-spacing: -.075em;
                    margin: 16px 0 18px;
                    max-width: 1050px;
                }

                .cxe-title span {
                    display: block;
                    background: linear-gradient(
                        100deg, #eafffc, #43efd8 55%, #8ccfff
                    );
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .cxe-description {
                    margin: 0;
                    max-width: 600px;
                    font-size: 15px;
                    line-height: 1.85;
                    color: #9cb6c4;
                }

                .cxe-intro-aside {
                    position: relative;
                    padding: 30px 28px;
                    border-left: 1px solid #3cbfae6b;
                    background: linear-gradient(
                        90deg, #123b3b4d, transparent
                    );
                }

                .cxe-intro-aside small {
                    font-size: 10px;
                    color: #69ebd4;
                    letter-spacing: 2px;
                    font-weight: 800;
                }

                .cxe-intro-aside p {
                    margin: 13px 0 0;
                    color: #c5d9df;
                    font-size: 14px;
                    line-height: 1.8;
                }

                .cxe-stage-section {
                    padding-bottom: 68px;
                }

                .cxe-stage-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 15px;
                    padding: 19px 3px;
                }

                .cxe-stage-label {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    color: #e4f5f8;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 1.7px;
                }

                .cxe-stage-indicator {
                    width: 9px;
                    height: 9px;
                    border: 1px solid #4af7d8;
                    border-radius: 2px;
                    transform: rotate(45deg);
                    box-shadow: 0 0 16px #4af7d86a;
                }

                .cxe-stage-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                    color: #77a6b5;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1.4px;
                }

                .cxe-stage-meta span + span::before {
                    content: '/';
                    margin-right: 16px;
                    color: #497581;
                }

                .cxe-stage-frame {
                    position: relative;
                    padding: 9px;
                    border: 1px solid #397e80;
                    border-radius: 24px;
                    background: linear-gradient(
                        140deg,
                        #143d49,
                        #071923 36%,
                        #071421 75%,
                        #153746
                    );
                    box-shadow:
                        0 34px 100px #00000075,
                        0 0 75px #22cbb017,
                        inset 0 1px 0 #b2fff32a;
                }

                .cxe-stage-frame::before,
                .cxe-stage-frame::after {
                    content: '';
                    position: absolute;
                    width: 73px;
                    height: 73px;
                    pointer-events: none;
                    z-index: 1;
                }

                .cxe-stage-frame::before {
                    top: -1px;
                    left: -1px;
                    border-top: 2px solid #5affdf;
                    border-left: 2px solid #5affdf;
                    border-top-left-radius: 24px;
                    filter: drop-shadow(0 0 9px #2de6cc);
                }

                .cxe-stage-frame::after {
                    bottom: -1px;
                    right: -1px;
                    border-right: 2px solid #5affdf;
                    border-bottom: 2px solid #5affdf;
                    border-bottom-right-radius: 24px;
                    filter: drop-shadow(0 0 9px #2de6cc);
                }

                .cxe-scene-host {
                    position: relative;
                    border-radius: 17px;
                    background: #050b14;
                }


                .cxe-understage {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 18px;
                    padding: 23px 4px 0;
                    border-bottom: 1px solid #4ad0bb23;
                    padding-bottom: 24px;
                }

                /* CINESIGHT_ALIGNED_SMART_SEATS_V1 */
                .cxe-understage-actions {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .cxe-page .cxe-understage-actions
                .cx-smart-seats-floating {
                    position: static !important;
                    inset: auto !important;
                    right: auto !important;
                    bottom: auto !important;
                    left: auto !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                }

                .cxe-page .cxe-understage-actions
                .cx-smart-seats-floating > button {
                    display: inline-flex !important;
                    align-items: center;
                    justify-content: center;
                    min-height: 45px;
                    margin: 0 !important;
                    padding: 13px 20px !important;
                    border-radius: 999px !important;
                    font-size: 12px !important;
                    white-space: nowrap;
                }

                @media (max-width: 700px) {
                    .cxe-understage-actions {
                        width: 100%;
                        justify-content: flex-start;
                    }

                    .cxe-page .cxe-understage-actions
                    .cx-smart-seats-floating > button {
                        white-space: normal;
                    }
                }



                .cxe-understage strong {
                    display: block;
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 17px;
                    letter-spacing: -.4px;
                }

                .cxe-understage p {
                    margin: 7px 0 0;
                    color: #7797a7;
                    font-size: 12px;
                    line-height: 1.7;
                }

                .cxe-understage-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    color: #061e1a;
                    background: #31e7cd;
                    padding: 13px 20px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 800;
                    text-decoration: none;
                    transition: filter .2s;
                }

                .cxe-understage-link:hover {
                    filter: brightness(1.12);
                }

                .cxe-footer {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 18px;
                    padding: 23px 0 29px;
                    border-top: 1px solid #ffffff14;
                    color: #688a9a;
                    font-size: 10px;
                    letter-spacing: 1.3px;
                }

                .cxe-page a:focus-visible {
                    outline: 3px solid #a9ffec;
                    outline-offset: 4px;
                }

                @media (max-width: 900px) {
                    .cxe-intro-grid {
                        grid-template-columns: 1fr;
                    }

                    .cxe-intro-aside {
                        max-width: 580px;
                    }
                }

                @media (max-width: 600px) {
                    .cxe-shell {
                        width: calc(100% - 24px);
                    }

                    .cxe-nav-inner {
                        min-height: 72px;
                    }

                    .cxe-brand {
                        font-size: 18px;
                    }

                    .cxe-nav-status {
                        display: none;
                    }

                    .cxe-back {
                        padding: 10px 12px;
                        font-size: 11px;
                    }

                    .cxe-title {
                        font-size: clamp(42px, 10vw, 65px);
                    }

                    .cxe-intro {
                        padding-top: 42px;
                    }

                    .cxe-description {
                        font-size: 13px;
                    }

                    .cxe-stage-meta {
                        font-size: 9px;
                        gap: 8px;
                    }

                    .cxe-stage-frame {
                        padding: 4px;
                        border-radius: 15px;
                    }

                    .cxe-scene-host {
                        border-radius: 11px;
                    }

                    .cxe-stage-frame::before {
                        border-top-left-radius: 15px;
                    }

                    .cxe-stage-frame::after {
                        border-bottom-right-radius: 15px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .cxe-page a {
                        transition: none !important;
                    }
                }
            `}</style>

            <nav className="cxe-nav">
                <div className="cxe-shell cxe-nav-inner">
                    <a href="/cinema" className="cxe-brand">
                        <span className="cxe-brand-mark" aria-hidden="true">&#9671;</span>
                        CineSight <b>X</b>
                    </a>

                    <div className="cxe-nav-actions">
                        <span className="cxe-nav-status">
                            <span className="cxe-nav-dot" />
                            SPATIAL VIEW SYSTEM
                        </span>

                        <a className="cxe-back" href="/cinema">&#8592; Back to Home</a>
                    </div>
                </div>
            </nav>

            <div className="cxe-shell">
                <header className="cxe-intro">
                    <div className="cxe-intro-grid">
                        <div>
                            <div className="cxe-eyebrow">
                                CINESIGHT-X / IMMERSIVE DIMENSION
                            </div>

                            <h1 className="cxe-title">
                                The Best View
                                <span>Starts Before</span>
                                The Movie.
                            </h1>

                            <p className="cxe-description">
                                Every seat holds a different perspective.
                                Step inside the studio and experience
                                the view before the movie begins.
                            </p>
                        </div>

                        <aside className="cxe-intro-aside">
                            <small>THE PERSPECTIVE ENGINE</small>
                            <p>
                                Move beyond a seat number.
                                Explore spatial viewing positions
                                in an interactive cinema environment.
                            </p>
                        </aside>
                    </div>
                </header>

                <section className="cxe-stage-section" aria-label="Cinema simulator">
                    <div className="cxe-stage-top">
                        <div className="cxe-stage-label">
                            <span className="cxe-stage-indicator" />
                            IMMERSIVE CINEMA SIMULATOR
                        </div>

                        <div className="cxe-stage-meta">
                            <span>180 SEATS</span>
                            <span>10 ROWS</span>
                            <span>3D PERSPECTIVE</span>
                        </div>
                    </div>

                    <div className="cxe-stage-frame">
                        <div className="cxe-scene-host">
                            <CinemaScene />
                        </div>
                    </div>

                    <div className="cxe-understage">
                        <div>
                            <strong>Your perspective is in your hands.</strong>
                            <p>
                                Select a seat in the simulator to explore its
                                viewing angle. Seat status is based on the demo studio.
                            </p>
                        </div>

                        <div className="cxe-understage-actions">


                            <a className="cxe-understage-link" href="/cinema/discover">
                            Discover Recommended Seats &#8599;
                        </a>


                            <div id="cxe-smart-seats-slot" />


                        </div>
                    </div>
                </section>

                <footer className="cxe-footer">
                    <span>CINESIGHT-X / CINEMA INTELLIGENCE</span>
                    <span>LARAVEL Â· REACT Â· THREE.JS</span>
                </footer>
            </div>
        </main>
    );
}