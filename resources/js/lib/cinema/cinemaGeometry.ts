export const CINEMA_CONFIG = {
    rows: 'ABCDEFGHIJ'.split(''),
    seatsPerRow: 18,
    screenWidth: 14,
    screenHeight: 6,
    screenBottom: 1.2,
    seatSpacing: 0.68,
    rowSpacing: 1.15,
    rowElevation: 0.25,
    frontRowDistance: 6.0,
    eyeHeightAboveFloor: 1.15,
} as const;

export type CinemaSeat = {
    row: string;
    number: number;
};

export type CameraPosition = {
    x: number;
    y: number;
    z: number;
};

export function getSeatCameraPosition(
    seat: CinemaSeat,
): CameraPosition {
    const { rows, seatsPerRow } = CINEMA_CONFIG;

    const rowIndex = rows.indexOf(
        seat.row.toUpperCase(),
    );

    if (
        rowIndex === -1 ||
        !Number.isInteger(seat.number) ||
        seat.number < 1 ||
        seat.number > seatsPerRow
    ) {
        throw new Error('Invalid cinema seat');
    }

    const distanceFromFront =
        rows.length - 1 - rowIndex;

    const x =
        (seat.number - (seatsPerRow + 1) / 2) *
        CINEMA_CONFIG.seatSpacing;

    const y =
        CINEMA_CONFIG.eyeHeightAboveFloor +
        distanceFromFront *
        CINEMA_CONFIG.rowElevation;

    const z =
        CINEMA_CONFIG.frontRowDistance +
        distanceFromFront *
        CINEMA_CONFIG.rowSpacing;

    return { x, y, z };
}

export function getScreenViewingAngles(
    seat: CinemaSeat,
) {
    const camera = getSeatCameraPosition(seat);

    const halfWidth =
        CINEMA_CONFIG.screenWidth / 2;

    const horizontalAngle =
        (
            Math.atan2(
                halfWidth - camera.x,
                camera.z,
            ) -
            Math.atan2(
                -halfWidth - camera.x,
                camera.z,
            )
        ) * (180 / Math.PI);

    const screenCenterY =
        CINEMA_CONFIG.screenBottom +
        CINEMA_CONFIG.screenHeight / 2;

    const verticalCenterAngle =
        Math.atan2(
            screenCenterY - camera.y,
            camera.z,
        ) * (180 / Math.PI);

    return {
        horizontalAngle: Number(
            horizontalAngle.toFixed(2),
        ),
        verticalCenterAngle: Number(
            verticalCenterAngle.toFixed(2),
        ),
        distanceToScreen: Number(
            Math.hypot(camera.x, camera.z).toFixed(2),
        ),
    };
}
