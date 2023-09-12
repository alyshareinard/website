<script>

    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { page } from '$app/stores'
    import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';


    export let data;
    console.log(data);
    console.log(data.user_name)
</script>


<p>
so far so good

</p>
Hello {data.user_name}
