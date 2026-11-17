import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
    CINEMA_CONFIG as C,
    getSeatCameraPosition,
    type CinemaSeat,
} from '@/lib/cinema/cinemaGeometry';

type ViewMode = 'center' | 'straight';

export default function CinemaPOVPreview({
    seat,
}: {
    seat: CinemaSeat;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<ViewMode>('center');

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#080d15');

        const position = getSeatCameraPosition(seat);

        const camera = new THREE.PerspectiveCamera(
            95, 16 / 9, 0.05, 120
        );

        camera.position.set(
            position.x, position.y, position.z
        );

        const screenY =
            C.screenBottom + C.screenHeight / 2;

        camera.lookAt(
            mode === 'center' ? 0 : position.x,
            screenY,
            0
        );

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 2)
        );

        renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';

        element.appendChild(renderer.domElement);

        const materials: THREE.Material[] = [];

        function mat(color: string) {
            const m = new THREE.MeshStandardMaterial({
                color,
                roughness: 0.85,
            });
            materials.push(m);
            return m;
        }

        const floorMat = mat('#24232d');
        const stepMat = mat('#49333c');
        const wallMat = mat('#151922');
        const chairMat = mat('#70263c');
        const cushionMat = mat('#a4425c');
        const armMat = mat('#211921');
        const frameMat = mat('#111720');

        function addBox(
            parent: THREE.Object3D,
            size: [number, number, number],
            pos: [number, number, number],
            material: THREE.Material
        ) {
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(...size),
                material
            );

            mesh.position.set(...pos);
            parent.add(mesh);

            return mesh;
        }

        scene.add(
            new THREE.AmbientLight('#c2d1e5', 1.8)
        );

        const screenLight = new THREE.PointLight(
            '#c6e3ff', 85, 35
        );
        screenLight.position.set(0, 5, 2);
        scene.add(screenLight);

        const screenMaterial =
            new THREE.MeshBasicMaterial({
                color: '#bed5e8',
            });
        materials.push(screenMaterial);

        addBox(
            scene,
            [C.screenWidth + 0.3,
             C.screenHeight + 0.3, 0.15],
            [0, screenY, -0.12],
            frameMat
        );

        addBox(
            scene,
            [C.screenWidth, C.screenHeight, 0.04],
            [0, screenY, 0],
            screenMaterial
        );

        const roomWidth = 15;
        const roomLength =
            C.frontRowDistance +
            (C.rows.length - 1) * C.rowSpacing + 4;

        // Front floor
        addBox(
            scene,
            [roomWidth, 0.12, C.frontRowDistance],
            [0, -0.06, C.frontRowDistance / 2],
            floorMat
        );

        // Side walls
        for (const side of [-1, 1]) {
            addBox(
                scene,
                [0.2, 9, roomLength],
                [side * 7.65, 4, roomLength / 2],
                wallMat
            );
        }

        // Rows: J nearest, A farthest.
        C.rows.forEach((row, index) => {
            const fromFront =
                C.rows.length - 1 - index;

            const z =
                C.frontRowDistance +
                fromFront * C.rowSpacing;

            const elevation =
                fromFront * C.rowElevation;

            // Solid platform with visible step height.
            const platformHeight = Math.max(
                0.12, elevation + 0.12
            );

            addBox(
                scene,
                [roomWidth, platformHeight, C.rowSpacing],
                [
                    0,
                    elevation - platformHeight / 2,
                    z
                ],
                floorMat
            );

            // Front vertical riser
            if (fromFront > 0) {
                addBox(
                    scene,
                    [roomWidth, C.rowElevation, 0.09],
                    [
                        0,
                        elevation - C.rowElevation / 2,
                        z - C.rowSpacing / 2
                    ],
                    stepMat
                );
            }

            // Step-edge lights
            const edgeLight =
                new THREE.MeshBasicMaterial({
                    color: '#b77a48'
                });
            materials.push(edgeLight);

            for (const side of [-1, 1]) {
                addBox(
                    scene,
                    [0.2, 0.02, 0.08],
                    [
                        side * 6.9,
                        elevation + 0.015,
                        z - C.rowSpacing / 2 + 0.04
                    ],
                    edgeLight
                );
            }

            for (
                let number = 1;
                number <= C.seatsPerRow;
                number++
            ) {
                const x =
                    (number - (C.seatsPerRow + 1) / 2) *
                    C.seatSpacing;

                const chair = new THREE.Group();
                chair.position.set(x, elevation, z);

                                // CINEMA_CHAIR_V5
                // Rounded upholstered cinema chair.
                const rounded = (
                    w: number,
                    h: number,
                    d: number,
                    radius: number,
                    px: number,
                    py: number,
                    pz: number,
                    material: THREE.Material,
                ) => {
                    const geometry = new RoundedBoxGeometry(
                        w, h, d, 4, radius
                    );

                    const mesh = new THREE.Mesh(
                        geometry, material
                    );

                    mesh.position.set(px, py, pz);
                    chair.add(mesh);
                    return mesh;
                };

                // Main upholstered backrest.
                // Lower than the previous oversized block.
                rounded(
                    0.53, 0.64, 0.16, 0.065,
                    0, 0.84, 0.22,
                    chairMat
                );

                // Soft center back cushion.
                rounded(
                    0.43, 0.52, 0.065, 0.03,
                    0, 0.85, 0.115,
                    cushionMat
                );

                // Upper headrest detail.
                rounded(
                    0.44, 0.12, 0.11, 0.045,
                    0, 1.12, 0.17,
                    chairMat
                );

                // Seat cushion.
                rounded(
                    0.49, 0.15, 0.49, 0.055,
                    0, 0.47, -0.10,
                    cushionMat
                );

                // Dark seat base.
                rounded(
                    0.49, 0.13, 0.45, 0.035,
                    0, 0.36, -0.09,
                    chairMat
                );

                // Armrests with rounded tops.
                for (const side of [-1, 1]) {
                    rounded(
                        0.085, 0.095, 0.40, 0.035,
                        side * 0.305, 0.64, -0.055,
                        armMat
                    );

                    rounded(
                        0.065, 0.38, 0.07, 0.02,
                        side * 0.305, 0.39, 0.11,
                        chairMat
                    );
                }

                scene.add(chair);
            }
        });

        // Use a local element, already checked for null.
        function resize() {
            const width = Math.max(
                element!.clientWidth, 1
            );
            const height = Math.max(
                element!.clientHeight, 1
            );

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height, false);
            renderer.render(scene, camera);
        }

        const observer = new ResizeObserver(resize);
        observer.observe(element);
        resize();

        return () => {
            observer.disconnect();

            scene.traverse(object => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                }
            });

            materials.forEach(m => m.dispose());
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [seat.row, seat.number, mode]);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: 540,
            overflow: 'hidden',
            background: '#080d15',
        }}>
            <div
                ref={containerRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                }}
            />

            <div style={{
                position: 'absolute',
                top: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 5,
                display: 'flex',
                gap: 5,
                padding: 5,
                borderRadius: 12,
                background: '#08111eee',
                border: '1px solid #ffffff30',
            }}>
                {([
                    ['center', 'Center Screen'],
                    ['straight', 'Straight Ahead'],
                ] as const).map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={mode === value}
                        onClick={() => setMode(value)}
                        style={{
                            padding: '10px 14px',
                            border: 0,
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 700,
                            color: mode === value
                                ? '#05221e' : '#ffffff',
                            background: mode === value
                                ? '#34e0c0' : 'transparent',
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
