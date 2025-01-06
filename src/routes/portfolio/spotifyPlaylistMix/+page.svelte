<script>
	//work with pageWerrors to upgrade to svelte5
	import { run } from 'svelte/legacy';

	import { analyticsStore } from '$lib/stores/analyticsStore';
	import { enhance } from '$app/forms';
//	import MultiSelect from 'svelte-multiselect';
	let playlist_choices = $state([]);
	let chosen_playlists = $state([]);
	let avoid_playlists = $state([]);
	let todays_playlist = $state();
	let { data, form } = $props();
	let todays_playlist_label = $state();
	let liked_songs = $state(false);

	const new_event = {
		id: 'any-random-id',
		data: {}, //anything you want to send to GA,
		event: 'name-of-your-event',
		type: 'event'
	};
	analyticsStore.update((existing_events) => [...existing_events, new_event]);

	if (data.playlists) {
		for (let i = 0; i < data.playlists.length; i++) {
			playlist_choices.push({ label: data.playlists[i].name, value: data.playlists[i].id });
		}
	} else {
		playlist_choices = [{ label: 'No playlists found' }];
	}

	run(() => {
		if (todays_playlist && todays_playlist.length > 0) {
			let todays_playlist0 = todays_playlist[0];
			todays_playlist_label = todays_playlist0.label;
		}
	});
</script>

<p>
	Hello {data.user_name}
</p>

<h2> We are upgrading to Svelte5, this app is currently unavailable</h2>

<h4>What do you want to hear?</h4>



<style>
	.mylist {
		display: flex;
	}
	.myitem {
		color: var(--accent);
		padding: 3px;
	}
</style>
