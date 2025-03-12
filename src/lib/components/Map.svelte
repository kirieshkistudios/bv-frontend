<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import ParkingSpot from './ParkingSpot.svelte';
	import type { LngLat, MapEventUpdateHandler, RouteFeature } from '@yandex/ymaps3-types';
	import { MarkerSize } from '$lib/types';
	import { markerSize } from '$lib/stores/spots.store';
	// Пропсы компонента
	let {
		apiKey,
		center = [37.588144, 55.733842],
		zoom = 10,
		lang = 'ru_RU',
		spots = []
	} = $props();

	let mapContainer;
	let map = null;
	let mapReady = $state(false);

	// Создаем контекст для дочерних компонентов
	setContext('map', {
		getMap: () => map,
		isReady: () => mapReady
	});

	onMount(async () => {
		await loadYandexMaps(apiKey, lang);
		await ymaps3.ready;

		const {
			YMap,
			YMapDefaultSchemeLayer,
			YMapDefaultFeaturesLayer,
			YMapFeatureDataSource,
			YMapControls,
			YMapListener
		} = ymaps3;

		ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', [
			'@yandex/ymaps3-default-ui-theme@latest'
		]);
		const { YMapGeolocationControl } = await ymaps3.import('@yandex/ymaps3-default-ui-theme');
		map = new YMap(mapContainer, {
			location: { center, zoom }
		});

		map.addChild(new YMapDefaultSchemeLayer());
		map.addChild(new YMapDefaultFeaturesLayer());
		map.addChild(
			new YMapControls({ position: 'right' }).addChild(
				new YMapGeolocationControl({ easing: 'ease-in-out', duration: 2000, zoom: 15 })
			)
		);

		const ZOOMS = {
			small: 15,
			big: 16
		};
		const updateHandler: MapEventUpdateHandler = (o) => {
			let newSize;
			if (o.location.zoom <= ZOOMS.small) {
				newSize = MarkerSize.small;
			} else if (o.location.zoom <= ZOOMS.big && o.location.zoom >= ZOOMS.small) {
				newSize = MarkerSize.medium;
			} else if (o.location.zoom >= ZOOMS.big) {
				newSize = MarkerSize.big;
			}
			if (newSize) {
				markerSize.set(newSize);
			}
		};

		map.addChild(
			new YMapListener({
				onUpdate: updateHandler
			})
		);

		mapReady = true;

		return () => {
			map?.destroy();
			map = null;
			mapReady = false;
		};
	});

	async function loadYandexMaps(apiKey, lang) {
		if (window.ymaps3) return;
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=${lang}`;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}
</script>

<div bind:this={mapContainer} class="map-container">
	{#if mapReady}
		{#each spots as spot}
			<ParkingSpot {spot} {map} />
		{/each}
	{/if}
</div>

<style>
	.map-container {
		width: 100%;
		min-height: 100dvh;
		height: 100dvh;
		background: #f0f0f0;
	}
</style>
