import { Head } from '@inertiajs/react';


const ROWS = 'ABCDEFGHIJ'.split('');


export default function CinemaSimulator() {


    return (
        <main className="cv-home">
            <Head title="CineSight-X | Enter the Cinemaverse" />

            <style>{`
                .cv-home {
                    --mint: #2de6cc;
                    min-height: 100vh;
                    color: #eefbff;
                    background: #030810;
                    font-family: 'Inter', system-ui, sans-serif;
                    overflow: hidden;
                }
                .cv-home * { box-sizing: border-box; }
                .cv-home a { text-decoration: none; }
                .cv-shell {
                    width: min(1440px, calc(100% - 64px));
                    margin: auto;
                }
                .cv-nav {
                    position: relative;
                    z-index: 20;
                    border-bottom: 1px solid #7ae5da18;
                    background: #030810b8;
                }
                .cv-nav-inner {
                    min-height: 80px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                }
                .cv-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 23px;
                    font-weight: 700;
                    letter-spacing: -1px;
                    color: white;
                }
                .cv-logo-mark {
                    width: 39px;
                    height: 39px;
                    display: grid;
                    place-items: center;
                    border-radius: 12px;
                    background: var(--mint);
                    color: #031716;
                    font-size: 25px;
                    box-shadow: 0 0 30px #2de6cc35;
                }
                .cv-logo b { color: var(--mint); }
                .cv-links {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 24px;
                    align-items: center;
                }
                .cv-links a {
                    color: #a2bdc8;
                    font-size: 13px;
                    font-weight: 600;
                    transition: color .2s;
                }
                .cv-links a:hover { color: var(--mint); }
                .cv-links .cv-link-accent {
                    border: 1px solid #318476;
                    color: var(--mint);
                    border-radius: 999px;
                    padding: 11px 18px;
                }

                .cv-hero {
                    isolation: isolate;
                    position: relative;
                    min-height: 760px;
                    display: flex;
                    align-items: center;
                    background:
                        radial-gradient(ellipse at 75% 40%, #0a575044, transparent 43%),
                        radial-gradient(ellipse at 15% 65%, #112b6240, transparent 50%),
                        #030810;
                }
                .cv-hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    pointer-events: none;
                    background-image:
                        radial-gradient(#a2fff76b .7px, transparent 1px);
                    background-size: 43px 43px;
                    opacity: .18;
                    mask-image: linear-gradient(120deg, transparent, black, transparent);
                }
                .cv-hero-inner {
                    display: grid;
                    grid-template-columns: 1fr 1.05fr;
                    align-items: center;
                    gap: clamp(20px, 3vw, 60px);
                    padding-top: 55px;
                    padding-bottom: 75px;
                }
                .cv-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--mint);
                    font-size: 10px;
                    letter-spacing: 2.4px;
                    font-weight: 800;
                }
                .cv-eyebrow::before {
                    content: '';
                    width: 26px;
                    height: 1px;
                    background: var(--mint);
                }
                .cv-heading {
                    margin: 25px 0;
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: clamp(53px, 6.3vw, 104px);
                    line-height: .99;
                    font-weight: 700;
                    letter-spacing: -.075em;
                }
                .cv-heading span {
                    display: block;
                    background: linear-gradient(110deg,#bafff2,#2de6cc,#80e5ff);
                    color: transparent;
                    background-clip: text;
                }
                .cv-subtitle {
                    max-width: 510px;
                    color: #9cb5c4;
                    line-height: 1.9;
                    font-size: 15px;
                    margin: 0 0 34px;
                }
                .cv-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    align-items: center;
                }
                .cv-primary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 28px;
                    color: #041c1a;
                    background: var(--mint);
                    font-size: 14px;
                    font-weight: 850;
                    border-radius: 999px;
                    padding: 19px 27px;
                    box-shadow: 0 0 48px #2de6cc26;
                    transition: transform .25s, box-shadow .25s;
                }
                .cv-primary:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 0 70px #2de6cc56;
                }
                .cv-secondary {
                    color: #c0d6df;
                    font-size: 13px;
                    padding: 15px;
                }
                .cv-secondary:hover { color: var(--mint); }
                .cv-facts {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 22px;
                    margin-top: 54px;
                    color: #698e9e;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1.6px;
                }
                .cv-facts span::before {
                    content: '';
                    display: inline-block;
                    background: var(--mint);
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    margin-right: 8px;
                    vertical-align: 2px;
                }

                .cv-universe {
                    position: relative;
                    display: grid;
                    place-items: center;
                    min-height: 610px;
                    min-width: 0;
                    perspective: 1100px;
                }
                .cv-halo {
                    position: absolute;
                    width: min(95%, 540px);
                    aspect-ratio: 1;
                    border-radius: 50%;
                    background: radial-gradient(
                        circle, #28b8a522 0%, #0a4f6250 43%,
                        transparent 69%
                    );
                    filter: blur(22px);
                    animation: cv-breathe 5s ease-in-out infinite;
                }
                .cv-ring {
                    position: absolute;
                    width: min(92%, 510px);
                    aspect-ratio: 1;
                    border-radius: 50%;
                    border: 2px solid #2de6cc9c;
                    box-shadow:
                        0 0 42px #23dbca42,
                        inset 0 0 60px #23dbca16;
                    transform: rotateX(13deg);
                    animation: cv-breathe 5s ease-in-out infinite;
                }
                .cv-ring::before {
                    content: '';
                    position: absolute;
                    inset: -23px;
                    border-radius: 50%;
                    border: 1px dashed #76fff65a;
                    animation: cv-spin 75s linear infinite;
                }
                .cv-ring::after {
                    content: '';
                    position: absolute;
                    inset: 19px;
                    border-radius: 50%;
                    border: 1px solid #93fff229;
                    box-shadow: 0 0 36px #2de6cc16;
                }
                .cv-beam {
                    position: absolute;
                    width: min(95%, 550px);
                    height: 490px;
                    pointer-events: none;
                    background: conic-gradient(
                        from 180deg at 50% 48%,
                        transparent 0deg, #1ed5c61c 38deg,
                        transparent 65deg, transparent 295deg,
                        #1ed5c61c 323deg, transparent 360deg
                    );
                    filter: blur(16px);
                    animation: cv-breathe 6s ease-in-out infinite alternate;
                }
                .cv-portal-content {
                    position: relative;
                    width: min(85%, 465px);
                    z-index: 2;
                    transform: perspective(900px) rotateX(7deg);
                    animation: cv-float 6s ease-in-out infinite;
                }
                .cv-screen {
                    width: 87%;
                    margin: 0 auto;
                    height: 115px;
                    display: grid;
                    place-items: center;
                    border: 1px solid #e7ffffa5;
                    border-radius: 4px;
                    background:
                        radial-gradient(ellipse at 50% 25%,
                            #7dffefa0, transparent 80%),
                        linear-gradient(145deg,#316a7e,#091d35 70%);
                    color: #dfffff;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 4px;
                    box-shadow:
                        0 0 60px #61f9e65c,
                        0 20px 65px #081b38;
                    transform: perspective(600px) rotateX(-9deg);
                }
                .cv-floor {
                    padding: 20px 13px 10px;
                    margin: 0 auto;
                    width: 96%;
                    background: linear-gradient(#2ce2c512,transparent);
                    border-top: 1px solid #2de6cc30;
                    transform: perspective(430px) rotateX(26deg);
                    transform-origin: top center;
                }
                .cv-row {
                    display: grid;
                    grid-template-columns: 12px repeat(18,minmax(0,1fr));
                    gap: 4px;
                    align-items: center;
                    margin: 5px 0;
                }
                .cv-row-label {
                    font-size: 9px;
                    color: #70a6b3;
                }
                .cv-seat {
                    aspect-ratio: 1.15;
                    border-radius: 3px 3px 1px 1px;
                    background: #285061;
                    box-shadow: inset 0 1px 0 #ffffff15;
                }
                .cv-seat.active {
                    background: #2de6cc;
                    box-shadow: 0 0 15px #2de6cc;
                }
                .cv-floating-card {
                    position: absolute;
                    z-index: 3;
                    bottom: 15px;
                    right: 0;
                    width: min(245px, 55%);
                    background: #0b1e2ce8;
                    border: 1px solid #2de6cc66;
                    border-radius: 17px;
                    padding: 19px;
                    backdrop-filter: blur(22px);
                    box-shadow: 0 20px 60px #0008;
                    animation: cv-float 5s ease-in-out infinite reverse;
                }
                .cv-card-label {
                    font-size: 10px;
                    letter-spacing: 1.7px;
                    color: #7ae6d5;
                    font-weight: 800;
                }
                .cv-card-seat {
                    font-family: 'Space Grotesk',sans-serif;
                    font-weight: 700;
                    font-size: 43px;
                    letter-spacing: -2px;
                    margin: 5px 0;
                }
                .cv-card-footer {
                    display: flex;
                    justify-content: space-between;
                    gap: 5px;
                    align-items: center;
                    font-size: 10px;
                    color: #91b1bd;
                }
                .cv-pick {
                    position: absolute;
                    z-index: 4;
                    left: 0;
                    bottom: 25px;
                    display: flex;
                    gap: 7px;
                }
                .cv-pick button {
                    cursor: pointer;
                    padding: 10px 13px;
                    border-radius: 9px;
                    background: #0b1e2c;
                    border: 1px solid #345b68;
                    color: #a9c8d2;
                    font-size: 11px;
                    font-weight: 700;
                }
                .cv-pick button[aria-pressed=true] {
                    border-color: var(--mint);
                    color: var(--mint);
                    background: #104039;
                }

                .cv-next {
                    border-top: 1px solid #ffffff12;
                    padding: 55px 0 90px;
                }
                .cv-next-top {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: end;
                    gap: 20px;
                    margin-bottom: 26px;
                }
                .cv-next h2 {
                    font-family: 'Space Grotesk',sans-serif;
                    font-size: clamp(28px,3.5vw,52px);
                    letter-spacing: -.055em;
                    margin: 13px 0 0;
                }
                .cv-next-description {
                    max-width: 330px;
                    font-size: 13px;
                    line-height: 1.8;
                    color: #8ea8b8;
                }
                .cv-steps {
                    display: grid;
                    grid-template-columns: repeat(3,minmax(0,1fr));
                    gap: 14px;
                }
                .cv-step {
                    padding: 28px;
                    border: 1px solid #2d4754;
                    background: linear-gradient(150deg,#102532,#091521);
                    border-radius: 18px;
                    transition: transform .25s,border-color .25s;
                }
                .cv-step:hover {
                    transform: translateY(-5px);
                    border-color: var(--mint);
                }
                .cv-step-index {
                    font-family: 'Space Grotesk',sans-serif;
                    color: var(--mint);
                    font-size: 35px;
                    font-weight: 700;
                }
                .cv-step h3 {
                    font-family: 'Space Grotesk',sans-serif;
                    font-size: 23px;
                    margin: 25px 0 8px;
                }
                .cv-step p {
                    color: #96acba;
                    font-size: 13px;
                    line-height: 1.8;
                }
                .cv-step a {
                    display: inline-block;
                    color: var(--mint);
                    margin-top: 12px;
                    font-size: 12px;
                    font-weight: 800;
                }
                .cv-footer {
                    border-top: 1px solid #ffffff18;
                    padding: 24px 0;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 15px;
                    font-size: 11px;
                    color: #7793a3;
                }
                .cv-home a:focus-visible,
                .cv-home button:focus-visible {
                    outline: 3px solid #bafff3;
                    outline-offset: 4px;
                }

                @keyframes cv-float {
                    0%,100% { transform: translateY(0); }
                    50% { transform: translateY(-13px); }
                }
                @keyframes cv-breathe {
                    0%,100% { opacity: .7; }
                    50% { opacity: 1; }
                }
                @keyframes cv-spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 1100px) {
                    .cv-hero-inner { grid-template-columns: 1fr; }
                    .cv-hero { min-height: auto; }
                    .cv-universe { max-width: 700px; width: 100%; margin: auto; }
                    .cv-heading { font-size: clamp(56px,9vw,96px); }
                }
                @media (max-width: 650px) {
                    .cv-shell { width: calc(100% - 30px); }
                    .cv-nav-inner {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 15px 0;
                    }
                    .cv-links { gap: 12px; }
                    .cv-links a { font-size: 11px; }
                    .cv-hero-inner { padding-top: 62px; padding-bottom: 45px; }
                    .cv-heading { font-size: clamp(49px,11vw,69px); }
                    .cv-subtitle { font-size: 13px; }
                    .cv-primary { width: 100%; }
                    .cv-facts { margin-top: 35px; }
                    .cv-universe { min-height: 430px; }
                    .cv-ring { width: 94%; }
                    .cv-halo { width: 100%; }
                    .cv-beam { width: 100%; }
                    .cv-portal-content { width: 88%; }
                    .cv-screen { height: 75px; font-size: 8px; }
                    .cv-seat { border-radius: 1px; }
                    .cv-row { gap: 2px; margin: 3px 0; }
                    .cv-floating-card {
                        right: 0;
                        bottom: 3px;
                        width: 180px;
                        padding: 13px;
                    }
                    .cv-card-seat { font-size: 32px; }
                    .cv-pick { left: 0; bottom: 7px; flex-direction: column; }
                    .cv-pick button { padding: 7px 9px; }
                    .cv-steps { grid-template-columns: 1fr; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .cv-home *, .cv-home *::before,
                    .cv-home *::after {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            <header className="cv-nav">
                <div className="cv-shell cv-nav-inner">
                    <a href="/cinema" className="cv-logo">
                        <span className="cv-logo-mark" aria-hidden="true">◇</span>
                        CineSight <b>X</b>
                    </a>
                    <nav className="cv-links" aria-label="Main navigation">
                        <a href="/cinema/discover">Discover</a>
                        <a href="/cinema/compare">Compare</a>
                        <a href="/cinema/experience">Cinema POV</a>
                        <a href="/cinema/discover" className="cv-link-accent">
                            Get Started ↗
                        </a>
                    </nav>
                </div>
            </header>

            <section className="cv-hero">
                <div className="cv-shell cv-hero-inner">
                    <div className="cv-copy">
                        <div className="cv-eyebrow">
                            THE NEXT DIMENSION OF CINEMA
                        </div>
                        <h1 className="cv-heading">
                            Don't Just
                            <span>Watch.</span>
                            Experience.
                        </h1>
                        <p className="cv-subtitle">
                            Discover your ideal seat, compare viewing geometry,
                            and step into a cinematic perspective before
                            the movie even begins.
                        </p>
                        <div className="cv-actions">
                            <a href="/cinema/discover" className="cv-primary">
                                Enter the Experience
                                <span aria-hidden="true">↗</span>
                            </a>
                            <a href="/cinema/compare" className="cv-secondary">
                                Compare Seats →
                            </a>
                        </div>
                        <div className="cv-facts">
                            <span>180 SEATS</span>
                            <span>10 ROWS</span>
                            <span>IMMERSIVE POV</span>
                        </div>
                    </div>

                    <div className="cv-universe">
                        <div className="cv-halo" />
                        <div className="cv-ring" />
                        <div className="cv-beam" />

                        <div className="cv-portal-content">
                            <div className="cv-screen">CINESIGHT X</div>

                            <div className="cv-floor" aria-hidden="true">
                                {[...ROWS].reverse().map((row) => (
                                    <div className="cv-row" key={row}>
                                        <span className="cv-row-label">{row}</span>
                                        {Array.from({ length: 18 }, (_, i) => {
                                            const id = row + (i + 1);
                                            return (
                                                <span
                                                    key={id}
                                                    className={
                                                        id === 'F10'
                                                            ? 'cv-seat active'
                                                            : 'cv-seat'
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>




                    </div>
                </div>
            </section>

            <section className="cv-next">
                <div className="cv-shell">
                    <div className="cv-next-top">
                        <div>
                            <div className="cv-eyebrow">HOW CINESIGHT WORKS</div>
                            <h2>Three steps. A whole new perspective.</h2>
                        </div>
                        <p className="cv-next-description">
                            From finding a position to experiencing
                            the view. Designed around one better decision.
                        </p>
                    </div>

                    <div className="cv-steps">
                        <article className="cv-step">
                            <div className="cv-step-index">01</div>
                            <h3>Discover</h3>
                            <p>Choose your viewing preferences and
                                discover recommended cinema seats.</p>
                            <a href="/cinema/discover">Start Discovery ↗</a>
                        </article>

                        <article className="cv-step">
                            <div className="cv-step-index">02</div>
                            <h3>Compare</h3>
                            <p>Explore seat scores, angles, and estimated
                                distances side by side.</p>
                            <a href="/cinema/compare">Compare Seats ↗</a>
                        </article>

                        <article className="cv-step">
                            <div className="cv-step-index">03</div>
                            <h3>Experience</h3>
                            <p>Enter the 3D studio and explore your chosen
                                seat from a cinematic POV.</p>
                            <a href="/cinema/experience">Open Simulator ↗</a>
                        </article>
                    </div>
                </div>
            </section>

            <footer className="cv-shell cv-footer">
                <span>CINESIGHT-X / IMMERSIVE CINEMA INTELLIGENCE</span>
                <span>Laravel · React · Three.js</span>
            </footer>
        </main>
    );
}
