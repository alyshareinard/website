<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	// Client API:
	const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<form method="POST">
	<label for="name">Name</label>
	<input type="text" name="name" bind:value={$form.name} />

	<label for="email">E-mail</label>
	<input type="email" name="email" bind:value={$form.email} />

	<div><button>Submit</button></div>
</form>

