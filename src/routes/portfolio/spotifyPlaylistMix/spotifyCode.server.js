const shuffle = (array) => { 
    return array.sort(() => Math.random() - 0.5); 
}; 

async function get_songs(url){
    console.log("fetching from ", url)
    const response = fetch(url, {
        method: "GET",
        headers: {
            Authorization: 'Bearer ' + url.cookies.get("access_token")
        }
    });
    let { items } = await response.json();
    return items
}

export async function create_playlist(chosen, avoid, todays_playlist, cookies) {
	console.log('in create_playlist');

	let tracks = [];
	chosen = eval(chosen);
	avoid = eval(avoid);
    todays_playlist = eval(todays_playlist);
    console.log("TODAYS_PLAYLIST ***************** : ", todays_playlist)

	const access_token = cookies.get('access_token');
	for (let i = 0; i < chosen.length; i++) {
		const chosen_id = chosen[i].value;
        let more=true
		let url = `https://api.spotify.com/v1/playlists/${chosen_id}/tracks?limit=50&fields=items(track(uri))`;
        while (more){
        let items = get_songs(url);
        for (let i=0; i<items.length; i++) {
            tracks.push(items[i].track.uri);
        }
        if (items.next) {
            url =items.next;
        } else {
            more = false;
        }
    }
	}
//    console.log("These are the track URIS: ", tracks)

    const todays_id=todays_playlist[0].value
    tracks=shuffle(tracks)
    tracks = tracks.slice(0, 100)
    //Now replace/add items in the new playlist
    const url = `https://api.spotify.com/v1/playlists/${todays_id}/tracks?uris=${tracks.toString()}`;
    const response = await fetch(url, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        headers: {
            Authorization: 'Bearer ' + access_token,
            "Content-Type": "application/json"
        },

    });
    console.log("Response from add today's list ", response)


	return tracks;
}

export async function get_playlists(cookies, playlists) {
    if (playlists){
        return(playlists)
    }
    console.log("in get playlists")
    const user_id=cookies.get("user_id")
    const access_token = cookies.get("access_token");
    const url = `https://api.spotify.com/v1/users/${user_id}/playlists?limit=50`;
    console.log(url)
	const response = await fetch(url, {
		headers: {
			Authorization: 'Bearer ' + access_token
		}
	});

    if (response.statusText) {
        console.log("Status text: ", response.statusText)
    } else {
        console.log("NO status text")
    }
    const data = await response.json();
	while (data.next) {
        const url = data.next;
        const response = await fetch(url, {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        });
        let more_playlists = await response.json();
        data.items = data.items.concat(more_playlists.items);
        data.next = more_playlists.next;
    }
	return(data.items)
}

export async function get_profile(cookies, profile) {
    if (profile){
        return profile
    }
        
	const response = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: 'Bearer ' + cookies.get("access_token")
		}
	});

	const data = await response.json();
	console.log("in get profile")
//	console.log(data)
    cookies.set("user_id", data.id)
	return(data.display_name)
}