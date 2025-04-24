const shuffle = (array: any[]) => {
	return array.sort(() => Math.random() - 0.5);
};

async function get_songs(url: string, token: string) {
	console.log('fetching songs from ', url);
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		console.log('response:', response);

		if (!response.ok) {
			console.error('Error:', response.statusText);
			return [];
		}

		const playlistResponse = await response.json();
		console.log('Response data:', playlistResponse);
		return playlistResponse.items || [];
	} catch (error) {
		console.error('Error fetching songs:', error);
		return [];
	}
}

async function get_all_songs(playlist: any[], access_token: string) {
	console.log('Get all songs');
	console.log('Playlist:', playlist);
	if (!playlist || !Array.isArray(playlist)) {
		console.error('Invalid playlist:', playlist);
		return [];
	}
	let songs = [];
	for (let i = 0; i < playlist.length; i++) {
		const playlist_id = playlist[i].value;
		let more = true;
		let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=50&fields=items(track(uri))`;
		while (more) {
			let items = await get_songs(url, access_token);
			console.log('received these items from get_songs: ', items);
			for (let i = 0; i < items.length; i++) {
				songs.push(items[i].track.uri);
			}
			if (items.next) {
				url = items.next;
			} else {
				more = false;
			}
		}
	}
	return songs;
}

async function get_all_liked(access_token: string) {
	console.log('Get all liked');

	let songs = [];

	let more = true;
	let url = `https://api.spotify.com/v1/me/tracks?limit=50&fields=items(track(uri))`;
	while (more) {
		let items = await get_songs(url, access_token);
		console.log('received these items from get_songs: ', items);
		for (let i = 0; i < items.length; i++) {
			songs.push(items[i].track.uri);
		}
		if (items.next) {
			url = items.next;
		} else {
			more = false;
		}
	}

	return songs;
}

export async function create_playlist(liked_songs: boolean, chosen: string, avoid: string, todays_playlist: string, cookies: any) {
	try {
		const access_token = cookies.get('access_token', { path: '/portfolio/spotifyPlaylistMix' });
		if (!access_token) {
			console.error('Access token not found');
			return null;
		}

		console.log('liked_songs:', liked_songs);
		console.log('chosen:', chosen);
		console.log('avoid:', avoid);
		console.log('todays_playlist:', todays_playlist);

		const chosenArray = JSON.parse(chosen);
		const avoidArray = avoid ? JSON.parse(avoid) : [];
		const todaysPlaylistValue = todays_playlist ? JSON.parse(todays_playlist) : false;

		let tracks: string[] = [];
		let chosen_songs: string[] = [];

		if (liked_songs) {
			console.log('getting liked songs');
			chosen_songs = await get_all_liked(access_token);
			console.log('chosen songs length:', chosen_songs.length);
		} else if (chosenArray && Array.isArray(chosenArray)) {
			chosen_songs = await get_all_songs(chosenArray, access_token);
			console.log('chosen songs from playlists length:', chosen_songs.length);
		}

		let avoid_songs: string[] = [];
		if (avoidArray && Array.isArray(avoidArray)) {
			avoid_songs = await get_all_songs(avoidArray, access_token);
			console.log('avoid songs length:', avoid_songs.length);
		}

		tracks = chosen_songs.filter(track => !avoid_songs.includes(track));
		console.log('tracks after filtering:', tracks.length);

		if (todaysPlaylistValue) {
			tracks = shuffle(tracks);
		}

		tracks = tracks.slice(0, 50);
		tracks = shuffle(tracks);

		console.log('final tracks length:', tracks.length);

		const response = await fetch('https://api.spotify.com/v1/me/playlists', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: 'New Playlist'
			})
		});

		if (!response.ok) {
			throw new Error('Failed to create playlist');
		}

		const playlistData = await response.json();
		const playlistId = playlistData.id;

		// Add tracks to the playlist
		const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				uris: tracks
			})
		});

		if (!addTracksResponse.ok) {
			throw new Error('Failed to add tracks to playlist');
		}

		return tracks;
	} catch (error) {
		console.error('Error in create_playlist:', error);
		return null;
	}
	});

	if (response.statusText != 'OK') {

		return 'All done!  Go check out your playlist in Spotify.';
	} else {
		console.log('response.statusText: ', response.statusText);
		return 'There was a problem.  Please try again.' + response.statusText;
	}
}

export async function get_playlists(cookies: any, playlists: any) {
	if (playlists) {
		return playlists;
	}

	const user_id = cookies.get('user_id', { path: '/' });
	const access_token = cookies.get('access_token', { path: '/' });
	const url = `https://api.spotify.com/v1/users/${user_id}/playlists?limit=50`;

	const response = await fetch(url, {
		headers: {
			Authorization: 'Bearer ' + access_token
		}
	});

	if (response.statusText != 'OK') {
		console.log('Status text: ', response.statusText);
	} else {
		console.log('Okay so far');
		let data = await response.json();
		let nextURL = data.next;
		while (nextURL) {
			const url = data.next;
			const response = await fetch(url, {
				headers: {
					Authorization: 'Bearer ' + access_token
				}
			});
			let more_playlists = await response.json();
			data.items = data.items.concat(more_playlists.items);
			nextURL = more_playlists.next;
		}

		//		console.log(data.items);
		return data.items;
	}
}

export async function get_profile(cookies: any, profile: any) {
	if (profile) {
		return profile;
	}

	const response = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: 'Bearer ' + cookies.get('access_token', { path: '/' })
		}
	});

	const data = await response.json();
	console.log('in get profile');
	//	console.log(data)
	cookies.set('user_id', data.id, { path: '/' });
	return data.display_name;
}
