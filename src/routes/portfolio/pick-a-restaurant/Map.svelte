<script>
	let container = $state();
	let map;
	let zoom = 8;
	let center = { lat: -34.397, lng: 150.644 };

	import { onMount } from 'svelte';

	onMount(async () => {
		map = new google.maps.Map(container, {
			zoom,
			center,
			styles: mapStyles // optional
		});
	});
</script>

<div class="full-screen" bind:this={container}></div>

<style>
	.full-screen {
		width: 100vw;
		height: 100vh;
	}
</style>
