<script>
    import { page } from '$app/stores';
    import Header from './Header.svelte';
	import Footer from "./Footer.svelte";
    import './global.css';

</script>

<Header/>

<main>
<slot/>

</main>
<Footer/>



