<script lang="ts">
	import type { PageData } from './$types';
	let showContact=false;
	export let data: PageData;
	import ContactModal from './contactModal.svelte';
	import { Card } from '$lib/components/Card';
	import { contactFormSchema } from '$lib/schemas';
	import { LOGNAME } from '$env/static/private';
    
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
			link: '/portfolio/spotifyPlaylistMix'
		},
		{
			front: 'CSV formatter',
			back: 'Upload a CSV file, and then download it in a different format',
			link: '/portfolio/csvUpdater'
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
	function toggleContact() {
		console.log("toggling contact modal")
		showContact = !showContact;
	}


//	main {
//        background: linear-gradient(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.40)), url($lib/images/background-wall.jpg)
//	}

</script>

<body>
	<main>
		<div class="mainNav">
			{#each main_cards as card}
				{#if card['link']}
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
				{:else}
				<div class="divnopad" on:click={toggleContact} on:keypress={toggleContact}>
					<Card cardHeight={mainHeight} cardWidth={mainWidth}>
						<div slot="content">
							{card['front']}
						</div>
						<div slot="backContent">
							{card['back']}
						</div>
					</Card>
					</div>
				{/if}
			{/each}
		</div>
		<p>Do you have tasks you have to repeat over and over?  You've looked for a simple app, but none exist?  Here are some examples of apps I've created. </p>

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

		{#if showContact}

		<ContactModal showContact data={data.contactModal} />

		{/if}
	</main>
</body>

<style>
	main{
		justify-content: center;
	}
	body {
		background: transparent;
	}
	.mainNav {
		display: grid;
		justify-content: center;
		justify-items:center;
        grid-template-columns: repeat(auto-fit,minmax(320px, 1fr));
		grid-auto-rows: 225px;
		padding:2%;
		width: 96%;
		height: 100%;
	

	}
	.portfolioNav {
		width:96%;
        padding:2%;
		display: grid;
		justify-content: center;
		justify-items:center;
        grid-template-columns: repeat(auto-fit,minmax(260px, 1fr));
        grid-auto-rows: 175px;

	}
	.divnopad {
		padding: 0px;
		margin:0;
	}
	</style>

