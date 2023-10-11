<script>
	let base = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
	let params = {
		key: 'AIzaSyDDQkZiYCXR4Chb6g5Z4dvI5D3YaVc6MlQ',
		location: '-33.8670522,151.1957362',
		radius: '1500',
		type: 'restaurant'
	};
    let restaurants;

	async function getRestaurants () {
		restaurants = await fetch(
			`${base}?location=${params.location}&radius=${params.radius}&type=${params.type}&key=${params.key}`,
			{
				method,
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			}
        ).then(response => response.json());
        console.log("response: ", response);
	};
	console.log(restaurants);
</script>

<div>
	<input type="text" bind:value={params.location} placeholder="Location" />
</div>
<div>
	<input type="text" bind:value={params.radius} placeholder="Distance" />
</div>
<button on:click={getRestaurants}>Find</button>
