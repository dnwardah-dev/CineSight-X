export type ApiSeat = {
    id: number;
    seat_id: string;
    row: string;
    number: number;
    is_active: boolean;
};

type SeatInventoryResponse = {
    success: boolean;
    data: {
        studio_id: number;
        total_seats: number;
        active_seats: number;
        seats: ApiSeat[];
    };
};

export async function getStudioSeats(
    signal?: AbortSignal,
): Promise<ApiSeat[]> {
    const response = await fetch('/api/v1/studios/1/seats', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
        signal,
    });

    if (!response.ok) {
        throw new Error(`Seat API error: ${response.status}`);
    }

    const result =
        (await response.json()) as SeatInventoryResponse;

    if (
        result.success !== true ||
        !Array.isArray(result.data?.seats)
    ) {
        throw new Error('Invalid Seat API response');
    }

    return result.data.seats;
}