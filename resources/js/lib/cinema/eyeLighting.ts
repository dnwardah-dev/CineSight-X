export type EyePosition = {
    x: number;
    y: number;
    z: number;
};

export type LightingInput = {
    eye: EyePosition;
    screenCenter: EyePosition;
    screenWidth: number;
    screenHeight: number;
    luminance: number;
};

export type LightingResult = {
    estimatedLux: number;
    distanceMeters: number;
    horizontalAngleDegrees: number;
    viewingAngleDegrees: number;
};

export function calculateEyeLighting(
    input: LightingInput
): LightingResult {
    const {
        eye,
        screenCenter,
        screenWidth,
        screenHeight,
        luminance,
    } = input;

    const valid = [
        eye.x, eye.y, eye.z,
        screenCenter.x, screenCenter.y, screenCenter.z,
        screenWidth, screenHeight, luminance,
    ].every(Number.isFinite);

    if (
        !valid ||
        screenWidth <= 0 ||
        screenHeight <= 0 ||
        luminance < 0 ||
        eye.z <= screenCenter.z
    ) {
        throw new Error('Invalid lighting geometry');
    }

    const dx = screenCenter.x - eye.x;
    const dy = screenCenter.y - eye.y;
    const dz = screenCenter.z - eye.z;

    const distance = Math.hypot(dx, dy, dz);

    const nx = dx / distance;
    const ny = dy / distance;
    const nz = dz / distance;

    const cols = 24;
    const rows = 14;

    const patchWidth = screenWidth / cols;
    const patchHeight = screenHeight / rows;
    const patchArea = patchWidth * patchHeight;

    let lux = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const px = screenCenter.x
                + (col + 0.5 - cols / 2) * patchWidth;

            const py = screenCenter.y
                + (row + 0.5 - rows / 2) * patchHeight;

            const vx = px - eye.x;
            const vy = py - eye.y;
            const vz = screenCenter.z - eye.z;

            const r = Math.hypot(vx, vy, vz);

            const emitterCos = (eye.z - screenCenter.z) / r;

            const receiverCos = Math.max(
                0,
                (nx * vx + ny * vy + nz * vz) / r
            );

            lux += luminance
                * emitterCos
                * receiverCos
                * patchArea
                / (r * r);
        }
    }

    const horizontalAngle = Math.atan2(
        Math.abs(dx),
        Math.abs(dz)
    ) * 180 / Math.PI;

    const viewingAngle = 2 * Math.atan2(
        screenWidth / 2,
        distance
    ) * 180 / Math.PI;

    return {
        estimatedLux: Number(lux.toFixed(2)),
        distanceMeters: Number(distance.toFixed(2)),
        horizontalAngleDegrees:
            Number(horizontalAngle.toFixed(2)),
        viewingAngleDegrees:
            Number(viewingAngle.toFixed(2)),
    };
}
