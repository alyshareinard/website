export function load({ data }) {
	return {
		...data,
		title: 'Spotify playlist mixer',
		description:
			'A personal tool that combines Spotify playlists into one shuffled mix, with duplicates and excluded playlists removed.'
	};
}
