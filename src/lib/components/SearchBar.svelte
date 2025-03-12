<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import { isPopupOpen, loading, markerDetails, clearSelection } from '$lib/stores/parking.store';
	import type { ParkingLotDetails } from '$lib/types';

	let placeholder: string = 'Search...';
	let query = $state('');
	let isMobile = $state(false);
	let unsubscribe: () => void;

	const checkPopupState = () => {
		unsubscribe = isPopupOpen.subscribe(($isOpen) => {
			if ($isOpen && isMobile) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		});
	};
	function handleSearch() {
		console.log('Searching for:', query);
	}

	function handleClickOutside(event: MouseEvent) {
		if (isMobile && isPopupOpen) {
			const target = event.target as HTMLElement;
			if (!target.closest('.search-container, .popup-container, .traffic-sign')) {
				clearSelection();
			}
		}
	}

	function checkScreenSize() {
		isMobile = window.innerWidth < 768;
		console.log(isMobile);
	}

	onMount(() => {
		checkScreenSize();
		checkPopupState();
		window.addEventListener('resize', checkScreenSize);
		document.addEventListener('click', handleClickOutside);
		return () => {
			unsubscribe?.();
			window.removeEventListener('resize', checkScreenSize);
		};
	});

	onDestroy(() => {
		// window.removeEventListener('resize', checkScreenSize);
		// document.removeEventListener('click', handleClickOutside);
		// document.removeEventListener('touchstart', handleTouchStart);
		// document.removeEventListener('touchmove', handleTouchMove);
	});
</script>

<div
	class="fixed z-50 transition-all duration-300
            {isPopupOpen && isMobile ? 'top-4' : 'bottom-4'} search-container right-4
            left-4 md:top-4 md:right-auto md:bottom-auto
            md:w-96"
	in:slide={{ delay: 100, duration: 300 }}
	out:slide={{ duration: 200 }}
>
	<!-- <div
		class="relative flex items-center gap-2 rounded-lg bg-white/95 p-2 shadow-lg backdrop-blur-sm"
		transition:fade
	>
		<input
			type="text"
			bind:value={query}
			on:keydown={(e) => e.key === 'Enter' && handleSearch()}
			class="flex-1 rounded-md px-4 py-2
           transition-all focus:ring-2 focus:ring-blue-500
           focus:outline-none"
			{placeholder}
		/>

		<button on:click={handleSearch} class="shrink-0 p-2 text-gray-600 hover:text-blue-600">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-5 w-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
				/>
			</svg>
		</button>
	</div> -->

	{#if $isPopupOpen}
		<div class="popup-container">
			{#if $loading}
				<div class="loader">
					<div class="pulse" />
					<div class="pulse delay-150" />
					<div class="pulse delay-300" />
				</div>
			{:else if $markerDetails}
				<div class="marker-info">
					<button on:click={clearSelection} class="close-button">✕</button>

					<h3 class="mb-2">{$markerDetails.name}</h3>
					<h4 class="location">📍 {$markerDetails.location_name}</h4>

					<div class="stats">
						<div class="stat">
							<span class="label">Свободно:</span>
							<span class="value"
								>{$markerDetails.free_spots}/{$markerDetails.capacity}</span
							>
						</div>
						<div class="stat">
							<span class="label">Статус:</span>
							<span class="status-badge {$markerDetails.status}">
								{{
									occupied: 'Занято',
									partially: 'Частично',
									free: 'Свободно',
									unknown: 'Неизвестно'
								}[$markerDetails.status]}
							</span>
						</div>
					</div>
				</div>
			{:else}
				<div class="error">Ошибка загрузки данных</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.popup-container {
		backdrop-filter: blur(10px);
		background: rgba(255, 255, 255, 0.95);
		padding: 1rem;
		box-shadow: #4b5563;
	}

	.stats {
		margin-top: 1rem;
		display: grid;
		gap: 0.75rem;
	}

	.stat {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label {
		color: #666;
		font-size: 0.9rem;
	}

	.value {
		font-weight: 600;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.8rem;
		text-transform: uppercase;
		font-weight: 500;
	}

	.status-badge.occupied {
		background: #fecaca;
		color: #dc2626;
	}
	.status-badge.partially {
		background: #fde68a;
		color: #d97706;
	}
	.status-badge.free {
		background: #a7f3d0;
		color: #059669;
	}
	.status-badge.unknown {
		background: #e5e7eb;
		color: #4b5563;
	}

	.location {
		color: #4b5563;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.error {
		color: #ef4444;
		padding: 1rem;
		text-align: center;
	}
</style>
