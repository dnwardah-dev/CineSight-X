export type Vec3 = {
    x: number;
    y: number;
    z: number;
};

export type ChairFace = {
    key: string;
    vertices: Vec3[];
    fill: string;
    stroke?: string;
};

export function buildCinemaChairFaces(
    x: number,
    floorY: number,
    z: number,
    id: string,
): ChairFace[] {
    const faces: ChairFace[] = [];

    const make = (
        name: string,
        vertices: Vec3[],
        fill: string,
        stroke?: string,
    ) => {
        faces.push({
            key: `${id}-${name}`,
            vertices,
            fill,
            stroke,
        });
    };

    const left = x - 0.275;
    const right = x + 0.275;

    // Bantalan duduk.
    make('cushion', [
        { x: left + 0.03, y: floorY + 0.50, z: z + 0.12 },
        { x: right - 0.03, y: floorY + 0.50, z: z + 0.12 },
        { x: right, y: floorY + 0.47, z: z - 0.32 },
        { x: left, y: floorY + 0.47, z: z - 0.32 },
    ], '#64253b', '#35121f');

    // Bagian depan bantalan.
    make('cushion-front', [
        { x: left, y: floorY + 0.47, z: z - 0.32 },
        { x: right, y: floorY + 0.47, z: z - 0.32 },
        { x: right, y: floorY + 0.39, z: z - 0.32 },
        { x: left, y: floorY + 0.39, z: z - 0.32 },
    ], '#35101e');

    // Armrest kiri dan kanan.
    for (const [side, armX] of [
        ['left', left],
        ['right', right],
    ] as const) {
        make(`arm-${side}`, [
            { x: armX - 0.04, y: floorY + 0.68, z: z + 0.12 },
            { x: armX + 0.04, y: floorY + 0.68, z: z + 0.12 },
            { x: armX + 0.04, y: floorY + 0.68, z: z - 0.30 },
            { x: armX - 0.04, y: floorY + 0.68, z: z - 0.30 },
        ], '#21171c', '#50313b');
    }

    // Sandaran dengan siluet atas melengkung.
    make('backrest', [
        { x: left, y: floorY + 0.60, z: z + 0.17 },
        { x: left - 0.02, y: floorY + 1.12, z: z + 0.17 },
        { x: left + 0.03, y: floorY + 1.26, z: z + 0.17 },
        { x: left + 0.13, y: floorY + 1.32, z: z + 0.17 },
        { x: right - 0.13, y: floorY + 1.32, z: z + 0.17 },
        { x: right - 0.03, y: floorY + 1.26, z: z + 0.17 },
        { x: right + 0.02, y: floorY + 1.12, z: z + 0.17 },
        { x: right, y: floorY + 0.60, z: z + 0.17 },
    ], 'url(#chairBack)', '#260b15');

    // Panel jok bagian dalam.
    make('backrest-panel', [
        { x: left + 0.075, y: floorY + 0.68, z: z + 0.18 },
        { x: left + 0.085, y: floorY + 1.15, z: z + 0.18 },
        { x: left + 0.15, y: floorY + 1.23, z: z + 0.18 },
        { x: right - 0.15, y: floorY + 1.23, z: z + 0.18 },
        { x: right - 0.085, y: floorY + 1.15, z: z + 0.18 },
        { x: right - 0.075, y: floorY + 0.68, z: z + 0.18 },
    ], '#8a3349', '#9b4358');

    return faces;
}
