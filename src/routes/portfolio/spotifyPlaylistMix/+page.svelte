<script lang="ts">
	import { analyticsStore } from '$lib/stores/analyticsStore';
	import { enhance } from '$app/forms';

	type Playlist = {
		name: string;
		id: string;
	};

	type PlaylistChoice = {
		label: string;
		value?: string;
	};

	const props = $props();
	const { data } = props;

	let playlist_choices = $state<PlaylistChoice[]>([]);
	let chosen_playlists = $state<PlaylistChoice[]>([]);
	let avoid_playlists = $state<PlaylistChoice[]>([]);
	let todays_playlist = $state<PlaylistChoice | undefined>();
	let todays_playlist_label = $state<string | undefined>();
	let liked_songs = $state(false);

	const new_event = {
		id: crypto.randomUUID(),
		data: {
			page: 'spotify-playlist-mix',
			action: 'page-view'
		},
		event: 'spotify-playlist-view',
		type: 'event'
	};

	analyticsStore.update((existing_events: any[]) => [...existing_events, new_event]);

	$effect(() => {
		if (data.playlists) {
			playlist_choices = data.playlists.map((playlist: Playlist) => ({
				label: playlist.name,
				value: playlist.id
			}));
		} else {
			playlist_choices = [{ label: 'No playlists found' }];
		}
	});

	$effect(() => {
		if (todays_playlist) {
			todays_playlist_label = todays_playlist.label;
		}
	});</script>

<main>
	<h1>Welcome, {data.user_name}!</h1>

	<section class="playlist-selection">
		<h2>Create Your Mix</h2>
		<p>Select playlists to include in your mix:</p>
		<form method="POST" use:enhance>
			<!-- Hidden inputs to pass data to server -->
			<input type="hidden" name="chosen_playlists" value={JSON.stringify(chosen_playlists)} />
			<input type="hidden" name="avoid_playlists" value={JSON.stringify(avoid_playlists)} />
			<input type="hidden" name="todays_playlist" value={JSON.stringify(todays_playlist)} />
			<input type="hidden" name="liked_songs" value={liked_songs} />
			<div class="playlist-lists">
				<div class="playlist-group">
					<h3>Include These Playlists:</h3>
					<div class="playlist-choices">
						{#each playlist_choices as choice}
						<button 
							type="button"
							class="playlist-choice" 
							class:selected={chosen_playlists.includes(choice)}
							onclick={() => {
							if (chosen_playlists.includes(choice)) {
								chosen_playlists = chosen_playlists.filter(p => p !== choice);
							} else {
								chosen_playlists = [...chosen_playlists, choice];
							}
						}}
						>
							{choice.label}
						</button>
						{/each}
					</div>
				</div>

				<div class="playlist-group">
					<h3>Exclude These Playlists:</h3>
					<div class="playlist-choices">
						{#each playlist_choices as choice}
							<button 
								type="button"
								class="playlist-choice" 
								class:selected={avoid_playlists.includes(choice)}
								onclick={() => {
							if (avoid_playlists.includes(choice)) {
								avoid_playlists = avoid_playlists.filter(p => p !== choice);
							} else {
								avoid_playlists = [...avoid_playlists, choice];
							}
						}}
							>
								{choice.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
			<div class="options">
				<label>
					<input type="checkbox" bind:checked={liked_songs}>
					Include Liked Songs
				</label>
			</div>
			<button type="submit" class="create-mix-btn">Create Mix</button>
		</form>

		{#if props.message}
			<div class="notification {props.success ? 'success' : 'error'}">
				<p>{props.message}</p>
				{#if props.success && props.playlistUrl}
					<p>Your new playlist contains {props.trackCount} tracks.</p>
					<a href={props.playlistUrl} target="_blank" rel="noopener noreferrer" class="playlist-link">
						Open in Spotify
					</a>
				{/if}
			</div>
		{/if}

		{#if todays_playlist_label}
			<div class="current-mix">
				<h3>Today's Mix:</h3>
				<p>{todays_playlist_label}</p>
			</div>
		{/if}
	</section>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.playlist-selection {
		margin-top: 2rem;
	}

	.playlist-lists {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin: 2rem 0;
	}

	.playlist-group {
		background: var(--surface-2);
		padding: 1.5rem;
		border-radius: 8px;
	}

	.playlist-choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.playlist-choice {
		padding: 0.5rem 1rem;
		border: 2px solid var(--accent);
		border-radius: 20px;
		background: transparent;
		color: var(--text);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.playlist-choice:hover {
		background: var(--accent);
		color: var(--surface);
	}

	.playlist-choice.selected {
		background: var(--accent);
		color: var(--surface);
	}

	.options {
		margin: 2rem 0;
	}

	.create-mix-btn {
		padding: 0.75rem 1.5rem;
		background: var(--accent);
		color: var(--surface);
		border: none;
		border-radius: 4px;
		font-weight: bold;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.create-mix-btn:hover {
		opacity: 0.9;
	}

	.current-mix {
		margin-top: 2rem;
		padding: 1.5rem;
		background: var(--surface-2);
		border-radius: 8px;
	}
	.notification {
		margin: 1rem 0;
		padding: 1rem;
		border-radius: 4px;
		text-align: center;
	}

	.success {
		background-color: #4caf50;
		color: white;
	}

	.error {
		background-color: #f44336;
		color: white;
	}

	.playlist-link {
		display: inline-block;
		margin-top: 0.5rem;
		padding: 0.5rem 1rem;
		background-color: #1db954;
		color: white;
		text-decoration: none;
		border-radius: 20px;
		font-weight: bold;
		transition: background-color 0.2s;
	}

	.playlist-link:hover {
		background-color: #1ed760;
	}
</style>
