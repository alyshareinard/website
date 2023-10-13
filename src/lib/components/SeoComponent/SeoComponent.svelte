<script>
	import { PUBLIC_CANONICAL_ORIGIN } from '$env/static/public';
	import { page } from '$app/stores';
	import  decorate  from '$lib/utils/decorate';

	
	export let data;
</script>

<svelte:head>
	<title>{$page.url.pathname !== '/' ? decorate(data.title) : data.title}</title>
	<meta name="description" content={data.description} />
	<link rel="canonical" href={data.canonical_url ?? `${PUBLIC_CANONICAL_ORIGIN}${$page.url.pathname}`} />
</svelte:head>