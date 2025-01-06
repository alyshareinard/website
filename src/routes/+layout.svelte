<script>
	import { run } from 'svelte/legacy';

	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import './global.css';
	
	import { page } from '$app/stores';
	import { PUBLIC_CANONICAL_ORIGIN } from '$env/static/public';
	import SeoComponent from '$component/SeoComponent/SeoComponent.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */


	/** @type {Props} */
	let { children } = $props();

	onMount(() => {
		
	});

	// Track page view when path changes.
	run(() => {
		$page.url.pathname, browser ;
	});
</script>

<SeoComponent
	url={$page.url}
	canonical_origin={PUBLIC_CANONICAL_ORIGIN}
	data={{ title: $page.data.title, description: $page.data.description }}
/>

<Header />

<main>
	{@render children?.()}
	
</main>
<Footer />
