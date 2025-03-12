export interface ParkingSpotMarker {
    id: string;
    lng: number;
    lat: number;
    status: 'occupied' | 'partially' | 'free' | 'unknown';
};

export interface ParkingLotResponse {
    id: number;
    longitude: number;
    latitude: number;
    free_spots: number;
    name: string;
    location_name: string;
    capacity: number;
}

export interface ParkingLotDetails extends ParkingSpotMarker {
    free_spots: number;
    location_name: string;
    name: string;
    capacity: number;
}
export type MapProps = {
    apiKey: string;
    center?: [number, number];
    zoom?: number;
    lang?: string;
};

export enum MarkerSize {
    small = 'small',
    big = 'big',
    medium = 'medium'
}