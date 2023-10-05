<script>

import { Card } from '$lib/components/Card';
const portHeight = 150;
const portWidth = 225;

const portfolio_cards = [
		{
			front: 'Noun Gender Game',
			back: 'A game to help language learners learn noun gender',
			link: '/portfolio/nounGenderGame'
		},
		{
			front: 'Spotify Playlist Generator',
			back: 'Mix and match your spotify playlists',
			link: '/portfolio/spotifyPlaylistMix'
		},
		{
			front: 'CSV formatter',
			back: 'Upload a CSV file, and then download it in a different format',
			link: '/portfolio/csvUpdater'
		}/*,
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
		}*/
	];
</script>

<div class="portfolioNav">
    {#each portfolio_cards as card}
	<div class="card">
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
	</div>
    {/each}
</div>


<style>
    .portfolioNav {
		width: 96%;
		padding: 2%;
		display: flex;
		flex-wrap:wrap;
		justify-content: space-evenly;
	

	}
	.card {
		padding:10px 10px;
	}
</style>



