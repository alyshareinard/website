<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<form use:enhance action="?/upload" method="POST" enctype="multipart/form-data">
	<input type="file" name="file" required />
	<button>Upload</button>

	{#if form}
		<p>uploaded {form.uploaded}</p>
	{/if}
</form>
