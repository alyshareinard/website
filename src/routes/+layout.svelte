<script>
    import Header from './Header.svelte';
	import Footer from "./Footer.svelte";
    import './global.css';
    import Analytics from '$component/GoogleAnalytics/Analytics.svelte';
    import { page } from '$app/stores';
	import { PUBLIC_CANONICAL_ORIGIN } from '$env/static/public';
	import  SeoComponent  from '$component/SeoComponent/SeoComponent.svelte';

</script>
<SeoComponent
	url={$page.url}
	canonical_origin={PUBLIC_CANONICAL_ORIGIN}
	data={{ title: $page.data.title, description: $page.data.description }}
/>
<Header/>

<main>
<slot/>
<Analytics />
</main>
<Footer/>



