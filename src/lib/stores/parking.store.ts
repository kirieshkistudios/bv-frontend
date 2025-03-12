// src/lib/stores/parking.store.ts
import { API_URL } from '$lib/config';
import type { ParkingSpotMarker, ParkingLotDetails, ParkingLotResponse } from '$lib/types';
import { writable, derived } from 'svelte/store';

export const selectedMarker = writable<ParkingSpotMarker | null>(null);
export const loading = writable(false);
export const markerDetails = writable<ParkingLotDetails | null>(null);
let updateInterval: NodeJS.Timeout | null = null;

export const isPopupOpen = derived(
    selectedMarker,
    $selected => $selected !== null
);

async function fetchParkingData(id: string): Promise<ParkingLotDetails> {
    const response = await fetch(`${API_URL}/parking_lots/${id}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data: ParkingLotResponse = await response.json();


    return {
        id: data.id.toString(),
        lng: data.longitude,
        lat: data.latitude,
        status: calculateStatus(data.free_spots, data.capacity),
        free_spots: data.free_spots,
        location_name: data.location_name,
        name: data.name,
        capacity: data.capacity
    };
}

function calculateStatus(freeSpots: number, capacity: number): ParkingSpotMarker['status'] {
    if (freeSpots === 0) return 'occupied';
    if (freeSpots < capacity * 0.3) return 'partially';
    if (freeSpots >= capacity * 0.3) return 'free';
    return 'unknown';
}

export async function selectMarker(marker: ParkingSpotMarker) {
    loading.set(true);
    selectedMarker.set(marker);

    try {
        // Первый запрос
        const data = await fetchParkingData(marker.id);
        markerDetails.set(data);

        // Запускаем периодическое обновление
        updateInterval = setInterval(async () => {
            try {
                const updatedData = await fetchParkingData(marker.id);
                markerDetails.set(updatedData);
            } catch (error) {
                console.error('Update error:', error);
            }
        }, 5000); // Обновляем каждые 30 секунд

    } catch (error) {
        console.error('Error fetching marker details:', error);
        markerDetails.set(null);
    } finally {
        loading.set(false);
    }
}

export function clearSelection() {
    if (updateInterval) clearInterval(updateInterval);
    selectedMarker.set(null);
    markerDetails.set(null);
}