<script>
	import { enhance } from '$app/forms';
	let message = "";
	const maxFileSize = 1000000;
	let myfile;


</script>


	<div>
		<h1>Hello</h1>
		<h2>Let's clean up those contacts!</h2>

		<form use:enhance method="POST">
			<input type="file" name="myfile" bind:this={myfile} accept=".csv" />

			<button> Get cleaned csv </button>
		</form>
	</div>
	{#if message}
	<p>{message}</p>
{/if}

<style>

</style>
