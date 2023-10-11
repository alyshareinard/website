<script>
    import Header from './Header.svelte';
	import Footer from "./Footer.svelte";
    import './global.css';
    import Analytics from '$lib/components/GoogleAnalytics/Analytics.svelte';
</script>

<Header/>

<main>
<slot/>
<Analytics />
</main>
<Footer/>



