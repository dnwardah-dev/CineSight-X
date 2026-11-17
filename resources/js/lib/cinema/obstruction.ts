export type SeatPosition = {
    x: number;
    y: number;
    z: number;
};

export type ObstructionResult = {
    obstructed: boolean;
    clearanceMeters: number;
    requiredHeightMeters: number;
};

/**
 * Estimate whether a viewer's sightline to a screen point
 * clears an obstruction located between the viewer and screen.
 *
 * Coordinates are expressed in meters.
 * The screen lies toward decreasing Z.
 */
export function calculateObstruction(
    viewer: SeatPosition,
    screen: SeatPosition,
    obstacle: SeatPosition,
    obstacleHeight: number,
): ObstructionResult {
    const totalDepth = viewer.z - screen.z;
    const obstacleDepth = viewer.z - obstacle.z;

    if (
        totalDepth <= 0 ||
        obstacleDepth <= 0 ||
        obstacleDepth >= totalDepth
    ) {
        return {
            obstructed: false,
            clearanceMeters: 0,
            requiredHeightMeters: 0,
        };
    }

    const fraction = obstacleDepth / totalDepth;

    const sightlineHeight =
        viewer.y + (screen.y - viewer.y) * fraction;

    const obstacleTop = obstacle.y + obstacleHeight;

    const clearance = sightlineHeight - obstacleTop;

    return {
        obstructed: clearance < 0,
        clearanceMeters: Number(clearance.toFixed(3)),
        requiredHeightMeters: Number(
            Math.max(0, obstacleTop - sightlineHeight).toFixed(3),
        ),
    };
}
