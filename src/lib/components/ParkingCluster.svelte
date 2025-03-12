<!-- src/lib/components/ParkingCluster.svelte -->
<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import {} from '$lib/stores/parking.store';
	import ParkingSpot from './ParkingSpot.svelte';
	import type { ParkingSpotMarker } from '$lib/types';
	import { mount } from 'svelte';

	export let spots: ParkingSpotMarker[] = [];
	const { getMap } = getContext('map');
	let map = getMap();

	let clusterer;
	let clusterModule;

	onMount(async () => {
		ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', [
			'@yandex/ymaps3-clusterer@latest'
		]);
		const { YMapClusterer, clusterByGrid } = await ymaps3.import('@yandex/ymaps3-clusterer');
		clusterModule = { YMapClusterer, clusterByGrid };
		const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapFeatureDataSource } =
			ymaps3;
		const features = spots.map((spot) => ({
			type: 'Feature',
			id: spot.id,
			geometry: { coordinates: [spot.lng, spot.lat] },
			properties: spot
		}));

		const cluster = (coordinates, features) =>
			new YMapMarker(
				{
					coordinates,
					source: 'my-source'
				},
				circle(features.length).cloneNode(true)
			);

		clusterer = new YMapClusterer({
			method: clusterModule.clusterByGrid({ gridSize: 64 }),
			features,
			marker: (feature) => createMarker(feature.properties),
			cluster
		});

		map.addChild(clusterer);
	});

	function createMarker(spot: ParkingSpotMarker) {
		const marker = document.createElement('div');
		mount(ParkingSpot, {
			target: marker,
			props: { spot, map }
		});
		return marker;
	}

	function circle(count) {
		const circle = document.createElement('div');
		circle.classList.add('circle');
		circle.innerHTML = `
        &lt;div class=&quot;circle-content&quot;&gt;
            &lt;span class=&quot;circle-text&quot;&gt;${count}&lt;/span&gt;
        &lt;/div&gt;
    `;
		return circle;
	}

	onDestroy(() => {
		if (clusterer && map) {
			map.removeChild(clusterer);
		}
	});
</script>

<style>
	.cluster-marker {
		width: 40px;
		height: 40px;
		background: #4285f4;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		transition: transform 0.2s;
	}

	.cluster-content {
		width: 32px;
		height: 32px;
		background: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cluster-count {
		color: #4285f4;
		font-weight: bold;
		font-size: 14px;
	}
</style>
