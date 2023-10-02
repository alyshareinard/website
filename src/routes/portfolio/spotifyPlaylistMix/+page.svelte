<script>
	import { enhance } from '$app/forms';
	import MultiSelect from 'svelte-multiselect';
	export let data;
	console.log(data);
	console.log(data.user_name);

	let playlist_choices = [];
	if (data.playlists) {
		for (let i = 0; i < data.playlists.length; i++) {
			playlist_choices.push({ label: data.playlists[i].name, value: data.playlists[i].id });
		}
	} else {
        playlist_choices = [{label:"Nothing here -- contact admin"}]
    }

	let chosen_playlists = [];
	let avoid_playlists = [];
	let todays_playlist;
	export let form;
	let todays_playlist_label;
	$: if (todays_playlist && todays_playlist.length > 0) {
		let todays_playlist0 = todays_playlist[0];
		todays_playlist_label = todays_playlist0.label;
		console.log('Todays Playlist:', todays_playlist_label);
	}
</script>

<p>
	Hello {data.user_name}
</p>

<h4>What do you want to hear?</h4>

<form use:enhance method="POST">
	<label for="chosen_playlists">
		<strong>Which playlists do you want to combine?</strong>
	</label>
	<MultiSelect
		--sms-options-bg="#333"
		--sms-text-color="var(--mainTheme)"
		options={playlist_choices}
		placeholder="Pick one or more playlist"
		name="chosen_playlists"
		required
		bind:selected={chosen_playlists}
		let:idx
		let:option
	>
		{option.label}
	</MultiSelect>

	<div style="margin-top:20px" />

	<label for="avoid_playlists">
		<strong>Which playlists contain songs you want to avoid (optional)?</strong>
	</label>
	<MultiSelect
		--sms-options-bg="#333"
		--sms-text-color="var(--mainTheme)"
		options={playlist_choices}
		placeholder="E.g. 'Christmas Songs', 'Sad Songs', etc."
		name="avoid_playlists"
		bind:selected={avoid_playlists}
		allowEmpty={true}
		let:idx
		let:option
	>
		{option.label}
	</MultiSelect>

	<div style="margin-top:20px" />
	<label for="todays_playlist">
		<strong
			>And which playlist will be used for this mix (existing songs will be replaced)?</strong
		>
	</label>
	<MultiSelect
		--sms-options-bg="#333"
		--sms-text-color="var(--mainTheme)"
		options={playlist_choices}
		maxSelect={1}
		placeholder="e.g. Today's Mix!"
		name="todays_playlist"
		bind:selected={todays_playlist}
		allowEmpty={true}
		let:idx
		let:option
	>
		{option.label}
	</MultiSelect>

	<div style="margin-top:30px" />

	{#if chosen_playlists.length > 0 && todays_playlist.length > 0}
		<h3>Summary:</h3>
		<h4>Add a mix of songs from:</h4>
		<div class="mylist">
			{#each chosen_playlists as chosen}
				<div class="myitem">
					{chosen.label}
				</div>
			{/each}
		</div>

		<h4>But no songs that are also in:</h4>
		<div class="mylist">
			{#each avoid_playlists as avoid}
				<div class="myitem">
					{avoid.label}
				</div>
			{/each}
		</div>

		<h4>
			Your new mix will be created in (ALL songs currently in this playlist will be removed): <span style="color:var(--accent)"
				>{todays_playlist_label}</span
			>
		</h4>
	{/if}
	<button> Create Today's Mix! </button>
</form>

{#if form?.message}
	<p>
		{form.message}
	</p>
{/if}
<div style="margin-top:20px" />

<style>
	.mylist {
		display: flex;
	}
	.myitem {
		color: var(--accent);
		padding: 3px;
	}
</style>
