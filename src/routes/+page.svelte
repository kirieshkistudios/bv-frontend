<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { parkingSpots, initParkingSpots, cleanupParkingSpots } from '$lib/stores/spots.store';
	import type { ParkingSpotMarker } from '$lib/types';
	import { onMount } from 'svelte';

	const testmarkers: ParkingSpotMarker[] = [
		{ id: '1', lng: 37.617634, lat: 55.755825, status: 'free' }, // Красная площадь
		{ id: '2', lng: 37.608322, lat: 55.733219, status: 'occupied' }, // Парк Зарядье
		{ id: '3', lng: 37.638587, lat: 55.725999, status: 'partially' }, // Павелецкая площадь
		{ id: '4', lng: 37.601495, lat: 55.744726, status: 'unknown' }, // Болотная набережная
		{ id: '5', lng: 37.539074, lat: 55.782524, status: 'free' }, // Москва-Сити
		{ id: '6', lng: 37.664659, lat: 55.761702, status: 'occupied' }, // Чистые пруды
		{ id: '7', lng: 37.830869, lat: 55.637038, status: 'free' }, // Бутово (Юг Москвы)
		{ id: '8', lng: 37.423838, lat: 55.891245, status: 'unknown' }, // Химки (МО)
		{ id: '9', lng: 37.85559, lat: 55.817234, status: 'partially' }, // Мытищи (МО)
		{ id: '10', lng: 37.408538, lat: 55.898694, status: 'free' } // Сходненская (Север)
	];

	onMount(async () => {
		await initParkingSpots();
		return () => cleanupParkingSpots();
	});
</script>

<Map
	apiKey="df084fff-df2c-414f-8382-2a41590c2e2a"
	center={[37.588144, 55.733842]}
	zoom={10}
	spots={$parkingSpots}
	lang="ru_RU"
/>
<SearchBar />
