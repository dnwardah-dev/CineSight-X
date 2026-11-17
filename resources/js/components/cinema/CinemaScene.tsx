import './CinemaMobileFix.css';
﻿import SeatRecommendationPanel from './SeatRecommendationPanel';
import ObstructionPanel from './ObstructionPanel';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { getStudioSeats } from '@/lib/cinema/seatApi';

const ROWS = 'ABCDEFGHIJ'.split('');
const SEAT_COUNT = 18;
const SPACING = 0.65;
const ROW_DEPTH = 1.20;
const RISE = 0.28;
const AISLE = 1.20;

type Seat = {
    id: string;
    row: string;
    number: number;
    x: number;
    y: number;
    z: number;
};

function makeSeat(row: string, number: number): Seat {
    const index = ROWS.indexOf(row);

    return {
        id: `${row}${number}`,
        row,
        number,
        x: (number - 9.5) * SPACING +
            (number <= 9 ? -AISLE / 2 : AISLE / 2),
        y: (9 - index) * RISE,
        z: 10 - index * ROW_DEPTH,
    };
}

const ALL_SEATS = ROWS.flatMap(row =>
    Array.from({ length: SEAT_COUNT }, (_, index) =>
        makeSeat(row, index + 1),
    ),
);

function CinematicCamera({
    seat,
    pov,
}: {
    seat: Seat;
    pov: boolean;
}) {
    const lookTarget = useRef(new THREE.Vector3(0, 2, 0));
    const destination = useMemo(() => new THREE.Vector3(), []);
    const aim = useMemo(() => new THREE.Vector3(), []);

    useFrame(({ camera }, delta) => {
        if (pov) {
            destination.set(seat.x, seat.y + 1.20, seat.z + 0.08);
            aim.set(0, 3.0, -8);
        } else {
            destination.set(23, 18, 28);
            aim.set(0, 2, 1);
        }

        const smooth = 1 - Math.exp(-2.4 * Math.min(delta, 0.05));

        camera.position.lerp(destination, smooth);

if (camera instanceof THREE.PerspectiveCamera) {
    const targetFov = pov ? 85 : 58;
    camera.fov = THREE.MathUtils.damp(
        camera.fov,
        targetFov,
        2.4,
        delta
    );
    camera.updateProjectionMatrix();
}
        lookTarget.current.lerp(aim, smooth);
        camera.lookAt(lookTarget.current);
    });

    return null;
}

function LuxurySeat({
    seat,
    active,
    onClick,
}: {
    seat: Seat;
    active: boolean;
    onClick: () => void;
}) {
    const fabric = active ? '#25e4c3' : '#841b30';
    const back = active ? '#0c9a84' : '#4d1020';

    return (
        <group
            position={[seat.x, seat.y, seat.z]}
            onClick={(event: ThreeEvent<MouseEvent>) => {
                event.stopPropagation();
                onClick();
            }}
        >
            {/* Cushioned seat */}
            <mesh position={[0, 0.40, -0.08]}>
                <boxGeometry args={[0.55, 0.16, 0.60]} />
                <meshStandardMaterial color={fabric} roughness={0.85} />
            </mesh>

            {/* Backrest */}
            <mesh position={[0, 0.68, 0.23]}>
                <boxGeometry args={[0.55, 0.40, 0.15]} />
                <meshStandardMaterial color={back} roughness={0.87} />
            </mesh>

            {/* Headrest */}
            <mesh position={[0, 0.89, 0.23]}>
                <boxGeometry args={[0.52, 0.12, 0.18]} />
                <meshStandardMaterial color={fabric} roughness={0.85} />
            </mesh>

            {/* Armrests */}
            {[-0.32, 0.32].map(x => (
                <mesh key={x} position={[x, 0.56, 0.02]}>
                    <boxGeometry args={[0.12, 0.19, 0.7]} />
                    <meshStandardMaterial color="#211a24" />
                </mesh>
            ))}

            {/* Seat structure */}
            <mesh position={[0, 0.25, 0.12]}>
                <boxGeometry args={[0.6, 0.5, 0.15]} />
                <meshStandardMaterial color="#171923" />
            </mesh>
        </group>
    );
}

function CinemaArchitecture() {
    return (
        <>
            <color attach="background" args={['#05070c']} />
            <fog attach="fog" args={['#05070c', 30, 85]} />

            <ambientLight intensity={0.35} />
            <hemisphereLight args={['#49617a', '#10090d', 0.6]} />

            <spotLight
                position={[0, 12, -1]}
                angle={0.85}
                penumbra={0.8}
                intensity={95}
                distance={36}
                color="#dceeff"
            />

            <pointLight
                position={[-11, 5, 4]}
                intensity={25}
                distance={19}
                color="#e49a5e"
            />

            <pointLight
                position={[11, 5, 4]}
                intensity={25}
                distance={19}
                color="#e49a5e"
            />

            {/* Main floor */}
            <mesh position={[0, -0.3, 2]}>
                <boxGeometry args={[27, 0.5, 30]} />
                <meshStandardMaterial color="#0c1018" />
            </mesh>

            {/* Tiered auditorium */}
            {ROWS.map((row, index) => {
                const height = (9 - index) * RISE;
                const z = 10 - index * ROW_DEPTH;

                return (
                    <group key={row}>
                        <mesh position={[0, height / 2 - 0.06, z]}>
                            <boxGeometry args={[24, height + 0.12, 1.43]} />
                            <meshStandardMaterial color="#252630" />
                        </mesh>

                        <mesh position={[0, height + 0.012, z]}>
                            <boxGeometry args={[24, 0.025, 1.4]} />
                            <meshStandardMaterial color="#34303a" />
                        </mesh>

                        {[-11.85, 11.85].map(x => (
                            <mesh
                                key={x}
                                position={[x, height + 0.035, z - 0.57]}
                            >
                                <boxGeometry args={[0.08, 0.035, 1.1]} />
                                <meshStandardMaterial
                                    color="#ffbc75"
                                    emissive="#ff9c3d"
                                    emissiveIntensity={1.8}
                                    toneMapped={false}
                                />
                            </mesh>
                        ))}
                    </group>
                );
            })}

            {/* Cinema screen */}
            <mesh position={[0, 4.0, -8]}>
                <boxGeometry args={[24, 9.5, 0.14]} />
                <meshStandardMaterial
                    color="#c8d8e6"
                    emissive="#7b98b4"
                    emissiveIntensity={0.45}
                    roughness={0.9}
                />
            </mesh>

            <Text
                position={[0, 4.0, -7.89]}
                fontSize={1.2}
                color="#13283a"
                anchorX="center"
                anchorY="middle"
            >
                CINESIGHT X
            </Text>

            {/* Screen frame */}
            {[-12.1, 12.1].map(x => (
                <mesh key={x} position={[x, 4.0, -7.9]}>
                    <boxGeometry args={[0.15, 9.7, 0.2]} />
                    <meshStandardMaterial color="#11141b" />
                </mesh>
            ))}

            {/* Side walls */}
            {[-13.5, 13.5].map(x => (
                <mesh key={x} position={[x, 5, 2]}>
                    <boxGeometry args={[0.45, 11, 29]} />
                    <meshStandardMaterial
                        color="#17141c"
                        roughness={0.95}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            {/* All 230 seats */}
        </>
    );
}

function CinemaWorld({
    selected,
    onSelect,
    pov,
}: {
    selected: Seat;
    onSelect: (seat: Seat) => void;
    pov: boolean;
}) {
    return (
        <>
            <CinemaArchitecture />

            {ALL_SEATS.map(seat => (
                <LuxurySeat
                    key={seat.id}
                    seat={seat}
                    active={seat.id === selected.id}
                    onClick={() => onSelect(seat)}
                />
            ))}

            <CinematicCamera seat={selected} pov={pov} />
        </>
    );
}

export default function CinemaScene() {
    const [selected, setSelected] = useState<Seat>(makeSeat('F', 12));
    const [pov, setPov] = useState(false);
    const [mapOpen, setMapOpen] = useState(false);
const [fullScreen, setFullScreen] = useState(false);


    // CINESIGHT_SEATMAP_CURSOR_FIX
    const [seatStatus, setSeatStatus] =
        useState<Map<string, boolean> | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        getStudioSeats(controller.signal)
            .then(items => {
                if (controller.signal.aborted) return;

                setSeatStatus(
                    new Map(items.map(item => [
                        item.seat_id,
                        item.is_active,
                    ] as const))
                );
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setSeatStatus(null);
                }
            });

        return () => controller.abort();
    }, []);

function selectSeat(seat: Seat) {
        if (seatStatus?.get(seat.id) !== true) return;
        setSelected(seat);
        setPov(true);
    }


    // CINESIGHT_DIRECT_SEAT_POV_V1
    useEffect(() => {
        if (!seatStatus) return;

        const requested = new URLSearchParams(
            window.location.search
        ).get('seat')?.toUpperCase();

        if (!requested) return;

        const match = /^([A-J])(1[0-8]|[1-9])$/.exec(requested);

        if (!match) return;

        if (seatStatus.get(requested) !== true) return;

        setSelected(makeSeat(match[1], Number(match[2])));
        setPov(true);
        setMapOpen(false);
    }, [seatStatus]);

    return (
        <div style={{
            position: fullScreen ? 'fixed' : 'relative',
            inset: fullScreen ? 0 : undefined,
            zIndex: fullScreen ? 9999 : undefined,
            width: '100%',
            borderRadius: 22,
            overflow: 'hidden',
            background: '#05070c',
            border: '1px solid #ffffff18',
        }}>
            <div style={{ height: fullScreen ? '100vh' : 'min(72vh, 760px)', minHeight: 460 }}>
                <Canvas
                    camera={{ position: [23, 18, 28], fov: 58 }}
                    gl={{ antialias: true, powerPreference: 'high-performance' }}
                    dpr={[1, 1.5]}
                >
                    <CinemaWorld
                        selected={selected}
                        onSelect={selectSeat}
                        pov={pov}
                    />
                </Canvas>
            </div>

            {/* Cinematic vignette */}
            <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(to bottom, #02040b99, transparent 28%, transparent 73%, #02040be8)',
            }} />

            {/* Cinema HUD */}
            <div style={{
                position: 'absolute',
                top: 23,
                left: 25,
                right: 25,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
                pointerEvents: 'none',
                flexWrap: 'wrap',
            }}>
                <div>
                    <div style={{
                        color: '#30e7c9',
                        fontSize: 10,
                        letterSpacing: 2.5,
                        fontWeight: 800,
                    }}>
                        CINESIGHT / IMMERSION ENGINE
                    </div>
                    <div style={{
                        fontSize: 13,
                        color: '#c0ccdb',
                        marginTop: 8,
                    }}>
                        {pov ? 'FIRST-PERSON VIEW' : 'CINEMA OVERVIEW'}
                    </div>
                </div>

                <div style={{
                    color: '#b9c9d6',
                    fontSize: 11,
                    padding: '9px 14px',
                    border: '1px solid #ffffff30',
                    borderRadius: 20,
                    background: '#07111bb8',
                }}>
                    ● STUDIO 01 / 180 SEATS
                </div>
            </div>

            <div className="cx-mobile-bottom-hud" style={{
                position: 'absolute',
                bottom: 25,
                left: 25,
                right: 25,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: 15,
            }}>
                <div className="cx-mobile-selected-seat" style={{
                    background: '#07111cdd',
                    border: '1px solid #ffffff25',
                    borderRadius: 16,
                    padding: '16px 20px',
                    backdropFilter: 'blur(15px)',
                }}>
                    <div style={{
                        fontSize: 10,
                        color: '#90a7b9',
                        letterSpacing: 2,
                    }}>
                        SELECTED SEAT
                    </div>
                    <div style={{
                        fontSize: 37,
                        fontWeight: 850,
                        color: '#39edce',
                        lineHeight: 1.2,
                    }}>
                        {selected.id}
                    </div>
                    <div style={{ fontSize: 11, color: '#9fb0c0' }}>
                        Row {selected.row} · Seat {selected.number}
                    </div>
                </div>

                <div className="cx-mobile-controls" style={{
                    display: 'flex',
                    gap: 9,
                    flexWrap: 'wrap',
                }}>
                    <button
                        onClick={() => setFullScreen(!fullScreen)}
                        style={{
                            background: '#172734',
                            border: '1px solid #ffffff30',
                            color: 'white',
                            padding: '13px 18px',
                            borderRadius: 11,
                            cursor: 'pointer',
                            fontWeight: 700,
                        }}
                    >
                        {fullScreen ? 'Exit Fullscreen' : '⛶ Fullscreen'}
                    </button>
                    <button
                        onClick={() => setMapOpen(!mapOpen)}
                        style={{
                            background: '#172734',
                            border: '1px solid #ffffff30',
                            color: 'white',
                            padding: '13px 18px',
                            borderRadius: 11,
                            cursor: 'pointer',
                            fontWeight: 700,
                        }}
                    >
                        {mapOpen ? 'Close Seat Map' : 'Choose Seat'}
                    </button>

                    <button
                        onClick={() => setPov(!pov)}
                        style={{
                            background: '#30e7c9',
                            color: '#05241f',
                            border: 0,
                            padding: '13px 20px',
                            borderRadius: 11,
                            cursor: 'pointer',
                            fontWeight: 800,
                        }}
                    >
                        {pov ? '↖ Studio Overview' : '◉ Enter Seat POV'}
                    </button>
                </div>
            </div>

            <div className="cx-mobile-analysis" style={{ display: 'contents' }}>
                <ObstructionPanel seat={selected} />
            </div>

            <SeatRecommendationPanel
                onChooseSeat={(row, number) => {
                    selectSeat(makeSeat(row, number));
                    setMapOpen(false);
                }}
            />
            {mapOpen && (
                <div style={{
                    position: 'absolute',
                    left: 15,
                    right: 15,
                    top: 95,
                    bottom: 125,
                    border: '1px solid #ffffff30',
                    borderRadius: 18,
                    background: '#08111df2',
                    backdropFilter: 'blur(24px)',
                    padding: 20,
                    overflow: 'auto',
                    zIndex: 3,
                }}>
                    <div style={{
                        fontSize: 17,
                        fontWeight: 800,
                        marginBottom: 6,
                        color: '#ffffff',
                    }}>
                        Choose Your Perspective
                    </div>

                    <p style={{
                        color: '#94a3b8',
                        fontSize: 12,
                        marginBottom: 20,
                    }}>
                        Select a seat to fly directly into its POV.
                        Row A is the highest and farthest from the screen.
                    </p>

                    <p role="status" style={{
    fontSize: 12,
    marginBottom: 12,
    color: '#9bc9bb',
}}>
    {seatStatus
        ? `${[...seatStatus.values()].filter(Boolean).length} active seats \u2022 ${[...seatStatus.values()].filter(v => !v).length} inactive seats`
        : 'Loading seat status or API unavailable'}
</p>
<div style={{ overflowX: 'auto', paddingBottom: 12 }}>
                        <div style={{ minWidth: 850 }}>
                            {ROWS.map(row => (
                                <div key={row} style={{
                                    display: 'flex',
                                    gap: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 7,
                                }}>
                                    <span style={{
                                        width: 23,
                                        color: '#8fa5b8',
                                        fontSize: 12,
                                    }}>
                                        {row}
                                    </span>

                                    {Array.from({ length: SEAT_COUNT }, (_, i) => {
                                        const number = i + 1;
                                        const id = `${row}${number}`;

                                        return (
                                            <button
        disabled={seatStatus?.get(id) !== true}
        aria-label={`Seat ${id}: ${seatStatus?.get(id) === false ? 'Inactive' : 'Active or loading'}`}
                                                key={id}
                                                title={`Seat ${id}`}
                                                onClick={() => {
                                                    selectSeat(makeSeat(row, number));
                                                    setMapOpen(false);
                                                }}
                                                style={{
        opacity: seatStatus?.get(id) === true ? 1 : 0.35,
        filter: seatStatus?.get(id) === false ? 'grayscale(1)' : 'none',
                                                    width: 29,
                                                    height: 28,
                                                    flexShrink: 0,
                                                    marginLeft: number === 10 ? 22 : 0,
                                                    background: selected.id === id
                                                        ? '#30e7c9'
                                                        : '#233243',
                                                    color: selected.id === id
                                                        ? '#04211c'
                                                        : '#d6e3ec',
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    border: selected.id === id
                                                        ? '1px solid #b4fff0'
                                                        : '1px solid #ffffff12',
                                                    borderRadius: 5,
                                                    cursor: seatStatus?.get(id) === true ? 'pointer' : 'not-allowed',
                                                }}
                                            >
                                                {seatStatus?.get(id) === false ? '\u00D7' : number}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(90deg, transparent, #a8dbea, transparent)',
                        height: 4,
                        maxWidth: 600,
                        margin: '24px auto 8px',
                    }} />

                    <div style={{
                        color: '#9fb5c4',
                        textAlign: 'center',
                        fontSize: 11,
                        letterSpacing: 3,
                    }}>
                        CINEMA SCREEN
                    </div>
                </div>
            )}
        </div>
    );
}
