const shuffle = (array) => {
	return array.sort(() => Math.random() - 0.5);
};

async function get_songs(url, token) {
	console.log('fetching songs from ', url);
    let items
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
    console.log('************************response: ', response)


    if (response.statusText != 'OK') {
		console.log('Status text: ', response.statusText);
        items=[]
        return items
	} else {
        const data  = await response.json();
        console.log('************************response.json(): ', data)
        items=data.items
        console.log("ADDING ITEMS: ", items)
        return items
    }

}

export async function create_playlist(chosen, avoid, todays_playlist, cookies) {
	console.log('in create_playlist');

	let tracks = [];
	chosen = eval(chosen);
	avoid = eval(avoid);
	todays_playlist = eval(todays_playlist);
	console.log('TODAYS_PLAYLIST ***************** : ', todays_playlist);

	const access_token = cookies.get('access_token');
	for (let i = 0; i < chosen.length; i++) {
		const chosen_id = chosen[i].value;
		let more = true;
		let url = `https://api.spotify.com/v1/playlists/${chosen_id}/tracks?limit=50&fields=items(track(uri))`;
		while (more) {
			let items = await get_songs(url, access_token);
            console.log("recieved these items from get_songs: ", items)
			for (let i = 0; i < items.length; i++) {
				tracks.push(items[i].track.uri);
			}
			if (items.next) {
				url = items.next;
			} else {
				more = false;
			}
		}
	}
	//    console.log("These are the track URIS: ", tracks)
    console.log(todays_playlist)
	const todays_id = todays_playlist[0].value;
    console.log('number of tracks to select from: ', tracks.length);
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
	console.log("Response from add today's list ", response);

	return tracks;
}

export async function get_playlists(cookies, playlists) {
	if (playlists) {
		return playlists;
	}
	console.log('in get playlists');
	const user_id = cookies.get('user_id');
	const access_token = cookies.get('access_token');
	const url = `https://api.spotify.com/v1/users/${user_id}/playlists?limit=50`;
	console.log(url);
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
			console.log(data.next);
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
