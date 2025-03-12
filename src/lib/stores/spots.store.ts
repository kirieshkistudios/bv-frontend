// src/lib/stores/parking.spots.store.ts
import { API_URL } from '$lib/config';
import { writable } from 'svelte/store';
import { type ParkingSpotMarker, type ParkingLotResponse, MarkerSize } from '$lib/types';

export const parkingSpots = writable<ParkingSpotMarker[]>([]);
let updateInterval: NodeJS.Timeout | null = null;
export const markerSize = writable<MarkerSize>(MarkerSize.small);

function calculateStatus(freeSpots: number, capacity: number): ParkingSpotMarker['status'] {
    if (freeSpots === 0) return 'occupied';
    if (freeSpots < capacity * 0.3) return 'partially';
    if (freeSpots >= capacity * 0.3) return 'free';
    return 'unknown';
}

function transformResponse(data: ParkingLotResponse[]): ParkingSpotMarker[] {
    return data.map(item => ({
        id: item.id.toString(),
        lng: item.longitude,
        lat: item.latitude,
        status: calculateStatus(item.free_spots, item.capacity)
    }));
}

async function fetchParkingSpots() {
    try {
        const response = await fetch(`${API_URL}/parking_lots`);
        if (!response.ok) throw new Error('Failed to fetch parking spots');
        const data: ParkingLotResponse[] = await response.json();
        parkingSpots.set(transformResponse(data));
    } catch (error) {
        console.error('Error fetching parking spots:', error);
    }
}

export async function initParkingSpots() {
    await fetchParkingSpots();
    updateInterval = setInterval(fetchParkingSpots, 30000);
}

export function cleanupParkingSpots() {
    if (updateInterval) clearInterval(updateInterval);
    parkingSpots.set([]);
}