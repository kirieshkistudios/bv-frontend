<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { MarkerSize, type ParkingSpotMarker } from '$lib/types';
	import { selectMarker } from '$lib/stores/parking.store';
	import { markerSize } from '$lib/stores/spots.store';

	let { spot, map }: { spot: ParkingSpotMarker; map: any } = $props();

	let marker;
	let markerElement: Element;
	let statusColors = {
		occupied: '#ff4444',
		partially: '#ffaa00',
		free: '#00cc66',
		unknown: '#666666'
	};
	let lMarkerSize = $state(MarkerSize.small);
	markerSize.subscribe((v) => {
		lMarkerSize = v;
	});

	onMount(async () => {
		const { YMap, YMapMarker } = ymaps3;
		marker = new YMapMarker({ coordinates: [spot.lng, spot.lat] }, markerElement);
		map.addChild(marker);
	});

	function onclick() {
		selectMarker(spot);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={markerElement}
	{onclick}
	class="traffic-sign"
	style="--status-color: {statusColors[spot.status]}; --size: {lMarkerSize === MarkerSize.small
		? '2rem'
		: '3rem'}; --sign-size: {lMarkerSize === MarkerSize.small ? '1rem' : '1.5rem'};
		--inner-size: {lMarkerSize === MarkerSize.small ? '1.3em' : '2rem'}"
>
	<div class="inner-circle" />
</div>

<style>
	.traffic-sign {
		width: var(--size);
		height: var(--size);
		background: var(--status-color);
		border: 2px solid white;
		border-radius: 30%;
		position: relative;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.inner-circle {
		width: var(--inner-size);
		height: var(--inner-size);
		background: rgba(255, 255, 255, 0.3);
		border-radius: 20%;
		position: absolute;
		transition: width height;
	}

	/* Traffic sign icon styling */
	.traffic-sign::after {
		content: 'P';
		color: white;
		font-size: var(--sign-size);
		font-weight: bold;
		position: relative;
	}
</style>
