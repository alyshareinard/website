<script>
    import { page } from '$app/stores';
    import Header from './Header.svelte';
	import Footer from "./Footer.svelte";
    import './global.css';

</script>
<body>
<Header/>

<main>
<slot/>
</main>
<div style="height:30px"/>
<div class="floatBottom">
<Footer/>
</div>

</body>
<style>

    main{
        background:transparent;
    }
    .floatBottom {
        width:100%;
        position:fixed;
        bottom:0;
        background:var(--mainThemeOpacity);
        margin-left:-10px
        
    }
</style>

