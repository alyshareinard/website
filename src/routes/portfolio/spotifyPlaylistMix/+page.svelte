<script lang="ts">
	import { enhance } from '$app/forms';
	import { DEFAULT_MIX_SIZE, MAX_MIX_SIZE } from '$lib/spotify/mix';

	type Playlist = { id: string; name: string };

	let { data, form } = $props();

	const DEFAULT_NAME = "Today's Mix!";

	const playlists = $derived<Playlist[]>(data.playlists ?? []);

	let chosen = $state<string[]>([]);
	let avoid = $state<string[]>([]);
	let includeLiked = $state(false);
	let limit = $state(DEFAULT_MIX_SIZE);
	let filter = $state('');
	let newName = $state(DEFAULT_NAME);
	let submitting = $state(false);
	// The playlist that receives the mix. Starts on one named "Today's Mix!" if there is one.
	let target = $state(
		(data.playlists as Playlist[] | undefined)?.find((p) => p.name === DEFAULT_NAME)?.id ?? 'new'
	);

	const visible = $derived(
		playlists.filter((p) => p.name.toLowerCase().includes(filter.trim().toLowerCase()))
	);

	// When two playlists share a name, number them so they can be told apart in the dropdown.
	const targetOptions = $derived.by(() => {
		const totals = new Map<string, number>();
		for (const p of playlists) totals.set(p.name, (totals.get(p.name) ?? 0) + 1);
		const seen = new Map<string, number>();
		return playlists.map((p) => {
			const n = (seen.get(p.name) ?? 0) + 1;
			seen.set(p.name, n);
			return { id: p.id, label: (totals.get(p.name) ?? 0) > 1 ? `${p.name} (#${n})` : p.name };
		});
	});

	const targetLabel = $derived(
		target === 'new'
			? newName.trim() || 'the new playlist'
			: (targetOptions.find((o) => o.id === target)?.label ?? 'that playlist')
	);
	const duplicatesOfDefault = $derived(playlists.filter((p) => p.name === DEFAULT_NAME).length);
	const canSubmit = $derived(
		!submitting && (chosen.length > 0 || includeLiked) && (target !== 'new' || newName.trim() !== '')
	);

	// After a mix is written to a brand-new playlist, keep using that playlist next time
	// instead of creating another one with the same name.
	$effect(() => {
		if (form?.success && form.created && form.playlistId) target = form.playlistId;
	});

	function toggle(list: 'chosen' | 'avoid', id: string) {
		if (list === 'chosen') {
			chosen = chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id];
			avoid = avoid.filter((x) => x !== id);
		} else {
			avoid = avoid.includes(id) ? avoid.filter((x) => x !== id) : [...avoid, id];
			chosen = chosen.filter((x) => x !== id);
		}
	}
</script>

{#if data.loadError}
	<p class="notice error" role="alert">{data.loadError}</p>
{/if}

{#if data.user_name}
	<p class="welcome">Signed in as <strong>{data.user_name}</strong></p>
{/if}

<form
	method="POST"
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => {
			// Keep the picks on screen after a run, so a tweak and re-run is quick
			await update({ reset: false });
			submitting = false;
		};
	}}
>
	<input type="hidden" name="chosen" value={JSON.stringify(chosen)} />
	<input type="hidden" name="avoid" value={JSON.stringify(avoid)} />
	<input type="hidden" name="liked" value={includeLiked} />

	<section class="card step">
		<h2>1. Pick your playlists</h2>
		<label class="search">
			<span class="sr-only">Search playlists</span>
			<input type="search" placeholder="Search your playlists" bind:value={filter} />
		</label>

		<div class="lists">
			<div class="list">
				<h3>Include</h3>
				<div class="choices">
					{#each visible as playlist (playlist.id)}
						<button
							type="button"
							class="choice"
							class:selected={chosen.includes(playlist.id)}
							aria-pressed={chosen.includes(playlist.id)}
							onclick={() => toggle('chosen', playlist.id)}>{playlist.name}</button
						>
					{:else}
						<p class="empty">{playlists.length ? 'No matches.' : 'No playlists found.'}</p>
					{/each}
				</div>
				<label class="check">
					<input type="checkbox" bind:checked={includeLiked} />
					Also include my liked songs
				</label>
			</div>

			<div class="list">
				<h3>Exclude</h3>
				<p class="hint">Songs on these playlists are left out of the mix.</p>
				<div class="choices">
					{#each visible as playlist (playlist.id)}
						<button
							type="button"
							class="choice avoid"
							class:selected={avoid.includes(playlist.id)}
							aria-pressed={avoid.includes(playlist.id)}
							onclick={() => toggle('avoid', playlist.id)}>{playlist.name}</button
						>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="card step">
		<h2>2. Choose where the mix goes</h2>
		<div class="row">
			<label>
				Put the mix in
				<select name="target" bind:value={target}>
					{#each targetOptions as option (option.id)}
						<option value={option.id}>{option.label}</option>
					{/each}
					<option value="new">+ A new playlist…</option>
				</select>
			</label>

			{#if target === 'new'}
				<label>
					New playlist name
					<input type="text" name="newName" bind:value={newName} maxlength="100" />
				</label>
			{/if}

			<label>
				Number of tracks
				<input
					class="short"
					type="number"
					name="limit"
					min="1"
					max={MAX_MIX_SIZE}
					bind:value={limit}
				/>
			</label>
		</div>

		{#if duplicatesOfDefault > 1}
			<p class="notice warn">
				You have {duplicatesOfDefault} playlists called "{DEFAULT_NAME}". Pick one above, and delete the
				extras in Spotify when you get a chance.
			</p>
		{/if}
	</section>

	<div class="submit">
		<p class="summary">
			{#if target === 'new'}
				Creates <strong>{targetLabel}</strong> with up to {limit} tracks.
			{:else}
				<strong>Everything currently in {targetLabel} will be replaced</strong> with up to {limit} tracks.
			{/if}
		</p>
		<button class="btn-primary" type="submit" disabled={!canSubmit}>
			{submitting ? 'Working…' : target === 'new' ? 'Create mix' : 'Replace playlist with mix'}
		</button>
	</div>
</form>

<div aria-live="polite">
	{#if form?.success}
		<div class="notice success">
			<p>
				{form.created ? 'Created a new playlist' : 'Updated your playlist'} with {form.trackCount} tracks.
			</p>
			<a class="btn-primary" href={form.playlistUrl} target="_blank" rel="noopener noreferrer"
				>Open in Spotify</a
			>
		</div>
	{:else if form?.message}
		<p class="notice error" role="alert">{form.message}</p>
	{/if}
</div>

<style>
	.welcome {
		text-align: center;
		color: var(--text-muted);
		margin: 0 0 1.5rem;
	}

	.step {
		margin-bottom: 1.25rem;
	}

	.step h2 {
		text-align: left;
		font-size: 1.25rem;
		margin: 0 0 1rem;
	}

	.step h3 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	.search input {
		width: 100%;
		margin-bottom: 1rem;
	}

	.lists {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1.25rem;
	}

	.list {
		background: var(--surface-2);
		border-radius: var(--radius-sm);
		padding: 1rem;
	}

	.hint,
	.empty {
		font-size: 0.88rem;
		color: var(--text-muted);
		margin: 0 0 0.5rem;
	}

	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		max-height: 16rem;
		overflow-y: auto;
		margin-bottom: 0.75rem;
	}

	.choice {
		margin: 0;
		padding: 0.35rem 0.8rem;
		font-size: 0.9rem;
		font-weight: 500;
		background: transparent;
		color: var(--text);
		border: 1px solid var(--border-strong);
		border-radius: 999px;
	}

	.choice:hover {
		background: rgba(80, 230, 230, 0.12);
		color: var(--text);
	}

	.choice.selected {
		background: var(--mainThemeLighter);
		border-color: var(--mainThemeLighter);
		color: var(--on-accent);
	}

	.choice.avoid {
		border-color: rgba(255, 165, 90, 0.5);
	}

	.choice.avoid:hover {
		background: rgba(255, 165, 90, 0.15);
	}

	.choice.avoid.selected {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--on-accent);
	}

	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.95rem;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.row label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.88rem;
		color: var(--text-muted);
		min-width: 0;
	}

	.row select,
	.row input[type='text'] {
		min-width: 14rem;
		max-width: 100%;
	}

	.short {
		width: 6rem;
	}

	.submit {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.summary {
		margin: 0;
		font-size: 1rem;
	}

	.submit .btn-primary {
		cursor: pointer;
		border: none;
	}

	.submit .btn-primary:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.notice {
		border-radius: var(--radius-sm);
		padding: 0.75rem 1rem;
		margin: 1rem 0;
		font-size: 0.95rem;
	}

	.notice p {
		margin: 0 0 0.75rem;
	}

	.notice.error {
		background: rgba(255, 99, 99, 0.12);
		color: #ffb3b3;
	}

	.notice.warn {
		background: rgba(255, 165, 90, 0.12);
		color: var(--accentLight);
	}

	.notice.success {
		background: rgba(80, 230, 130, 0.12);
		text-align: center;
	}

	@media (min-width: 800px) {
		.lists {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
