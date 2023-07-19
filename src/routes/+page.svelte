<script>
	import './global.css';
	import { Card } from '$lib/components/Card';
    //background textured grey, blocks rotate through pride color borders
    const mainHeight = 200;
    const mainWidth = 300;

    const portHeight = 150;
    const portWidth = 225;
	let main_cards = [
		{
			front: 'About',
			back: 'Rocket scientist',
			link: '/about'
		},
		{
			front: 'Offerings',
			back: 'Cool stuff',
			link: '/offerings'
		},
		{
			front: 'Contact',
			back: 'Contact me',
			link: '/contact'
		}
	];

	const portfolio_cards = [
		{
			front: 'Noun Gender Game',
			back: 'A game to help language learners learn noun gender',
			link: '/portfolio/nounGenderGame'
		},
		{
			front: 'Spotify Playlist Generator',
			back: 'Mix and match your spotify playlists',
			link: '/portfolio/spotifyPlaylistGenerator'
		},
		{
			front: 'CSV formatter',
			back: 'Upload a CSV file, and then download it in a different format',
			link: '/portfolio/csvFormatter'
		},
		{
			front: 'Allowance tracker',
			back: 'An app that lets you and your child keep track of allowance, current balance and chores',
			link: '/portfolio/allowanceTracker'
		},
		{
			front: 'Hubspot contacts',
			back: 'Pull Hubspot contacts associated with a given keyword',
			link: '/portfolio/hubspotContacts'
		},
		{
			front: 'Inventory tracker',
			back: 'Keep track of your inventory',
			link: '/portfolio/inventoryTracker'
		}
	];


//	main {
//        background: linear-gradient(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.40)), url($lib/images/background-wall.jpg)
//	}

</script>

<body>
	<main>
		<div class="mainNav">
			{#each main_cards as card}
				<a href={card['link']}>
					<Card cardHeight={mainHeight} cardWidth={mainWidth}>
						<div slot="content">
							{card['front']}
						</div>
						<div slot="backContent">
							{card['back']}
						</div>
					</Card>
				</a>
			{/each}
		</div>

		<h2 style="text-align: center;">Portfolio</h2>
		<div class="portfolioNav">
			{#each portfolio_cards as card}
				<a href={card['link']}>
					<Card cardHeight={portHeight} cardWidth={portWidth}>
						<div slot="content">
							{card['front']}
						</div>
						<div slot="backContent">
							{card['back']}
						</div>
					</Card>
				</a>
			{/each}
		</div>
	</main>
</body>

<style>
	body {
		background: transparent;
	}
	.mainNav {
		display: grid;
        grid-template-columns: repeat(auto-fill,minmax(325px, 1fr));
        padding:5%;
		width: 100%;
		height: 100%;
	}
	.portfolioNav {
		display: grid;
        grid-template-columns: repeat(auto-fill,minmax(250px, 1fr));
        grid-auto-rows: 175px;
        padding:5%;
        gap:5%;
	}
	</style>

