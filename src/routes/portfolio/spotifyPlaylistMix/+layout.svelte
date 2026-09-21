<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<svelte:head>
	<!-- A personal tool, not a page for search engines -->
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mixer">
	<header class="intro">
		<span class="eyebrow">Personal tool</span>
		<h1>Today's playlist</h1>
		<p class="lead">
			Combine your Spotify playlists into one fresh, shuffled mix. Exact duplicates are removed, and
			you can exclude playlists whose songs you don't want to hear. If your December dance mix still
			has your Christmas songs in it, and it's February, exclude the Christmas playlist.
		</p>
		<p class="note">
			This is a personal project rather than a public demo, so it may not work with your Spotify
			account.
		</p>
	</header>

	{@render children?.()}
</div>

<style>
	.intro {
		text-align: center;
		max-width: 42rem;
		margin: 2rem auto 2rem;
	}

	.intro h1 {
		margin: 0.3rem 0 0.75rem;
	}

	.lead {
		color: var(--text-muted);
		font-size: 1.1rem;
		margin: 0 0 0.75rem;
	}

	.note {
		font-size: 0.95rem;
		color: var(--text-muted);
		margin: 0;
	}
</style>
