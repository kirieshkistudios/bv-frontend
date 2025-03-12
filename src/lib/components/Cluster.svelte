<script lang="ts">
	import { onMount, getContext } from 'svelte';

	let { map, coordinates }: { map: any; coordinates: [number, number][] } = $props();

	let clusterElement;

	onMount(async () => {
		const { YMapClusterer, clusterByGrid } = await ymaps3.import('@yandex/ymaps3-clusterer');
		const points = coordinates.map((lnglat, i) => ({
			type: 'Feature',
			id: i,
			geometry: { coordinates: lnglat },
			properties: { name: 'Point of issue of orders' }
		}));
		const clusterer = new YMapClusterer({
			method: clusterByGrid({ gridSize: 64 }),
			features: points,
			marker,
			clusterElement
		});

		map.addChild(clusterer);
	});
</script>

<div bind:this={clusterElement}>йййййййййй</div>
