const shuffle = (array) => {
	return array.sort(() => Math.random() - 0.5);
};

async function get_songs(url, token) {
	console.log('fetching songs from ', url);
	let items;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
	console.log('************************response: ', response);

	if (response.statusText != 'OK') {
		console.log('Status text: ', response.statusText);
		items = [];
		return items;
	} else {
		const data = await response.json();
		console.log('************************response.json(): ', data);
		items = data.items;
		console.log('ADDING ITEMS: ', items);
		return items;
	}
}

async function get_all_songs(playlist, access_token) {
	console.log('Get all songs');
	console.log(playlist);
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

export async function create_playlist(chosen, avoid, todays_playlist, cookies) {
	let tracks = [];
	chosen = eval(chosen);
	avoid = eval(avoid);

	todays_playlist = eval(todays_playlist);

	const access_token = cookies.get('access_token');
	let chosen_songs = await get_all_songs(chosen, access_token);

	let avoid_songs = await get_all_songs(avoid, access_token);

	tracks = chosen_songs.filter((item) => !avoid_songs.includes(item));

	//    console.log("These are the track URIS: ", tracks)

	const todays_id = todays_playlist[0].value;

	tracks = [...new Set(tracks)];

	tracks = shuffle(tracks);
	tracks = tracks.slice(0, 100);
	//Now replace/add items in the new playlist
	const url = `https://api.spotify.com/v1/playlists/${todays_id}/tracks?uris=${tracks.toString()}`;
	const response = await fetch(url, {
		method: 'PUT', // *GET, POST, PUT, DELETE, etc.
		headers: {
			Authorization: 'Bearer ' + access_token,
			'Content-Type': 'application/json'
		}
	});

	return 'All done!  Go check out your playlist in Spotify.';
}

export async function get_playlists(cookies, playlists) {
	if (playlists) {
		return playlists;
	}

	const user_id = cookies.get('user_id');
	const access_token = cookies.get('access_token');
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

export async function get_profile(cookies, profile) {
	if (profile) {
		return profile;
	}

	const response = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: 'Bearer ' + cookies.get('access_token')
		}
	});

	const data = await response.json();
	console.log('in get profile');
	//	console.log(data)
	cookies.set('user_id', data.id);
	return data.display_name;
}
