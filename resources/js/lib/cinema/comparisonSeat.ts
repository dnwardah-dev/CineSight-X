/**
 * Picks an active seat with a meaningfully different position.
 * Does not change recommendation scores or seat availability.
 */
export function chooseContrastingSeat(
    first: string,
    activeIds: string[],
): string {
    const candidates = activeIds.filter((id) => id !== first);

    if (!candidates.length) return '';

    const parse = (id: string) => {
        const match = /^([A-J])(1[0-8]|[1-9])$/.exec(id);
        if (!match) return null;

        return {
            row: match[1].charCodeAt(0) - 65,
            number: Number(match[2]),
        };
    };

    const origin = parse(first);

    if (!origin) return candidates[0];

    const contrast = (id: string) => {
        const seat = parse(id);
        if (!seat) return false;

        return (
            Math.abs(seat.row - origin.row) >= 2 &&
            Math.abs(seat.number - origin.number) >= 3
        );
    };

    const showcaseOptions = [
        'H5', 'H14',
        'C5', 'C14',
        'I5', 'I14',
        'B5', 'B14',
    ];

    const showcase = showcaseOptions.find(
        (id) => candidates.includes(id) && contrast(id),
    );

    if (showcase) return showcase;

    const alternative = candidates.find(contrast);

    if (alternative) return alternative;

    const differentRow = candidates.find((id) => {
        const seat = parse(id);
        return seat && Math.abs(seat.row - origin.row) >= 2;
    });

    if (differentRow) return differentRow;

    return candidates.find((id) => {
        const seat = parse(id);
        return seat && Math.abs(seat.number - origin.number) >= 3;
    }) ?? candidates[0];
}
