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
	console.log('Getting songs from playlists...');
	console.log('Playlist data:', playlist);

	if (!playlist || !Array.isArray(playlist) || playlist.length === 0) {
		console.error('Invalid or empty playlist data');
		throw new Error('No playlists selected');
	}

	let songs: string[] = [];
	let failedPlaylists: string[] = [];

	for (const playlistItem of playlist) {
		if (!playlistItem?.value) {
			console.error('Invalid playlist item:', playlistItem);
			continue;
		}

		try {
			const playlist_id = playlistItem.value;
			console.log(`Fetching songs from playlist ${playlist_id}...`);

			let more = true;
			let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=50&fields=items(track(uri))%2Cnext%2Ctotal`;

			while (more) {
				const response = await fetch(url, {
					headers: {
						Authorization: `Bearer ${access_token}`
					}
				});

				if (!response.ok) {
					console.error(`Failed to fetch playlist ${playlist_id}:`, response.statusText);
					failedPlaylists.push(playlist_id);
					break;
				}

				const data = await response.json();
				console.log(`Total tracks in playlist ${playlist_id}:`, data.total);

				if (!data.items || !Array.isArray(data.items)) {
					console.error(`Invalid response data for playlist ${playlist_id}`);
					break;
				}

				for (const item of data.items) {
					if (item?.track?.uri) {
						songs.push(item.track.uri);
					}
				}

				if (data.next) {
					url = data.next;
				} else {
					more = false;
				}
			}

			console.log(`Retrieved ${songs.length} songs from playlist ${playlist_id}`);
		} catch (error) {
			console.error(`Error processing playlist ${playlistItem.value}:`, error);
			failedPlaylists.push(playlistItem.value);
		}
	}

	if (songs.length === 0) {
		let errorMessage = 'No songs found in the selected playlists';
		if (failedPlaylists.length > 0) {
			errorMessage += `. Failed to fetch from ${failedPlaylists.length} playlist(s)`;
		}
		throw new Error(errorMessage);
	}

	console.log(`Total unique songs found: ${songs.length}`);
	return [...new Set(songs)]; // Remove duplicates
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
			return 'Access token not found. Please try logging in again.';
		}

		console.log('Creating playlist with options:', {
			liked_songs,
			chosen,
			avoid,
			todays_playlist
		});

		const chosenArray = JSON.parse(chosen);
		const avoidArray = avoid ? JSON.parse(avoid) : [];
		const todaysPlaylistValue = todays_playlist ? JSON.parse(todays_playlist) : false;

		if (!liked_songs && (!chosenArray || !Array.isArray(chosenArray) || chosenArray.length === 0)) {
			return 'Please select at least one playlist or your liked songs.';
		}

		let tracks: string[] = [];
		let chosen_songs: string[] = [];

		try {
			if (liked_songs) {
				console.log('Fetching liked songs...');
				chosen_songs = await get_all_liked(access_token);
				console.log(`Found ${chosen_songs.length} liked songs`);
			} else {
				console.log('Fetching songs from selected playlists...');
				chosen_songs = await get_all_songs(chosenArray, access_token);
				console.log(`Found ${chosen_songs.length} songs in selected playlists`);
			}

			if (chosen_songs.length === 0) {
				return 'No songs found in the selected source(s). Please try different playlists or your liked songs.';
			}
		} catch (error: any) {
			console.error('Error fetching songs:', error);
			return error.message || 'Failed to fetch songs from the selected source(s).';
		}

		let avoid_songs: string[] = [];
		if (avoidArray && Array.isArray(avoidArray) && avoidArray.length > 0) {
			try {
				avoid_songs = await get_all_songs(avoidArray, access_token);
				console.log(`Found ${avoid_songs.length} songs to avoid`);
			} catch (error) {
				console.error('Error fetching songs to avoid:', error);
				// Continue without avoid songs if there's an error
			}
		}

		tracks = chosen_songs.filter(track => !avoid_songs.includes(track));
		console.log(`${tracks.length} songs remaining after filtering`);

		if (tracks.length === 0) {
			return 'No songs remaining after filtering. Please try different playlists.';
		}

		if (todaysPlaylistValue) {
			tracks = shuffle(tracks);
		}

		tracks = tracks.slice(0, 50);
		tracks = shuffle(tracks);

		console.log(`Creating playlist with ${tracks.length} tracks`);

		const response = await fetch('https://api.spotify.com/v1/me/playlists', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: 'New Mixed Playlist',
				description: 'Created by Spotify Playlist Mixer'
			})
		});

		if (!response.ok) {
			throw new Error('Failed to create playlist');
		}

		const playlistData = await response.json();
		const playlistId = playlistData.id;

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
		} else {
			return 'All done!  Go check out your playlist in Spotify.';
		}
	} catch (error) {
		console.error('Error in create_playlist:', error);
		return null;
	}
};

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
