<script>
    import { page } from '$app/stores';
    import Header from './Header.svelte';
	import Footer from "./Footer.svelte";

</script>
<main>
<Header/>

<body>
<slot/>
</body>


<Footer/>

</main>
<style>
    main{
        background: linear-gradient(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.40)), url($lib/images/background-wall.jpg);
        background-position: center center;
        background-size: cover;
        margin:-20px;
        padding:20px;
    }
    body{
        background:transparent
    }

</style>

