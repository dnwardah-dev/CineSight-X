export type POVZone =
    | 'rear-left'
    | 'rear-center'
    | 'rear-right'
    | 'middle-left'
    | 'middle-center'
    | 'middle-right'
    | 'front-left'
    | 'front-center'
    | 'front-right';

export function getPOVZone(
    row: string,
    number: number
): POVZone {
    const rows = 'ABCDEFGHIJ';
    const index = rows.indexOf(row.toUpperCase());

    if (index < 0 || number < 1 || number > 18) {
        throw new Error('Invalid cinema seat');
    }

    const depth =
        index <= 2 ? 'rear' :
        index <= 6 ? 'middle' : 'front';

    const side =
        number <= 6 ? 'left' :
        number <= 12 ? 'center' : 'right';

    return `${depth}-${side}` as POVZone;
}

export function getPOVImagePath(
    row: string,
    number: number
): string {
    const zone = getPOVZone(row, number);

    return `/cinema/studio-01/pov/${zone}/view.webp`;
}
