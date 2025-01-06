<script module>
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export async function load({ session }) {
		const { user } = session;
		return {
			props: {
				user
			}
		};
	}
</script>

<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { user } = $props();

	onMount(() => {
		if (window.opener && user) {
			const event = new CustomEvent('auth-success', { detail: { user } });
			window.opener.dispatchEvent(event);
		} else {
			goto('/');
		}
	});
</script>
