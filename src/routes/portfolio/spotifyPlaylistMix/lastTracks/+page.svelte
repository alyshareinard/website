<script>
	let { songs = $bindable([]), next = $bindable(), total } = $props();

	let inProgress;

	let left = $derived(total - (songs.length - 1));

	const loadMore = async () => {
		if (inProgress || !next) return;

		inProgress = true;
		await loadTracks(next);
		inProgress = false;
	};

	const loadTracks = async (url) => {
		if (!url) return;

		const result = await fetch(url.replace('https://api.spotify.com/v1/', '/api/')).then((r) =>
			r.json()
		);
		if (result.items) {
			songs = [...songs, ...result.items];
		}
		next = result.next;
	};
</script>

<ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-12">
	{#each songs as song (song.track.name)}
		{@const artist = song.track.artists.reduce((acc, curr) => [...acc, curr.name], []).join(', ')}
		<li>
			<span class="text-neutral-400 font-semibold">{artist}</span>
			<p class="text-2xl font-bold text-white">{song.track.name}</p>
		</li>
	{/each}
</ul>

<div class="flex flex-col items-center my-16">
	<button
		onclick={loadMore}
		class="text-white border border-white font-bold px-4 py-1 rounded-full text-sm hover:bg-white hover:text-black"
	>
		Load more
	</button>

	{#if left > 0}
		<p class="text-neutral-500 font-bold text-sm mt-2">{left} left</p>
	{/if}
</div>
