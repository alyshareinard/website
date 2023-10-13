export function load( {data} ) {
    console.log("data", data)
	return {
        user_name:data.user_name,
        playlists:data.playlists,
		title: 'Mix and match your Spotify playlists',
		description:
			"A tool that works with the Spotify API. You can select one or more playlists from your account and combine "
            +"them into a single playlist, random order, no duplicates.  Requires a Spotify premium account."
	};
}