<script>
	import { page } from '$app/stores';
	$: console.log('page', $page);
</script>

<h1>You've reached an error page</h1>
<h2>{$page.status}</h2>
<p>{$page.error?.message}</p>
