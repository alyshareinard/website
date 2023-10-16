<script lang="ts">
	import { Card } from '$lib/components/Card';
	import Carousel from 'svelte-carousel';
	import { onMount } from 'svelte';
	import PorfolioCards from './portfolioCards.svelte';


	
	let showTestimonials=false
	const mainHeight = 200;
	const mainWidth = 300;
	onMount(() => {
		showTestimonials=true
	})
	let main_cards = [
		{
			front: 'About me',
			back: 'A little bit about me and my work',
			link: '/about'
		},
		{
			front: 'What I can do for you',
			back: 'Web pages, apps, integrations, and more',
			link: '/contact'
		},
/*		{
			front: 'Contact me',
			back: 'I usually get back to you within 24 hours',
			link: '/contact'
		},*/
		{
			front: 'Portfolio',
			back: 'Descriptions and examples of my work',
			link: '/portfolio'
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

	const testimonials = [
		{
			text: [" Alysha delivered exceptional work in a short period of time. Her communication skills were excellent and she was very responsive throughout the project. When I went to Alysha with my workflow issue, she was able to suggest multiple ways to help me achieve my goal. Alysha was pleasant to work with and I would gladly hire her for future automation jobs. She would be an excellent choice for any automation projects you may have."],
			author: 'Shane Price, Freelance Web Designer/Developer'
		},
		{
			text: ['I have worked with Alysha on three different projects and each time she has met and exceeded expectations. Each project required ingenuity from Alysha and she provided different options and pros/cons for each in order to achieve our desired outcome. Alysha is both easy and enjoyable to work with and I will continue to hire her for future projects.'],
			author: 'Allison Pescatore, Marketing Manager, InvestEd'
		},
		{
			text: ['Alysha helped us to improve the Airtable process. Recommend!', 'Alysha was amazing to work with! Very knowledgable and professional.','Knows the info, gets the job done. Highly recommend and will work with again.']
		}
	];

</script>

<main>
		<div role=menu class="mainNav">
			{#each main_cards as card}
			<div class="card">
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
				{/if}
			</div>
			{/each}
		</div>
		<div>
		<div class="testimonials">
			{#if showTestimonials}
		<Carousel autoplay pauseOnFocus autoplayDuration={4000}>
			{#each testimonials as testimonial}
				<div class="verticalCenter">
					{#each testimonial.text as t}
					<h3>"{t}"</h3>
					{/each}
					{#if testimonial.author}
						<h4>{testimonial.author}</h4>
					{/if}
				</div>
			{/each}
		</Carousel>
		{/if}
	</div>
</div>
<div class="leftJustified">
		<h3 class="darkBackground">
			Do you have tasks you have to repeat over and over? You've looked for a simple app or tool, but none
			exist? Here are some simple examples of apps I've created. See <a href ="/portfolio">Portfolio</a> for descriptions of more complex apps I've developed for customers. 
			</h3>

	</div>
		<PorfolioCards/>
		<div class="centered">
		<h2 class="darkBackground">
			Tell me about your app idea and lets turn it into reality! <button><a href ="/contact#contactForm">Contact me</a></button>
		</h2>
	</div>

	</main>


<style>
	main {
		justify-content: center;
	}
	.card {
		padding:10px 10px;
	}
	.mainNav {
		display: flex;
		flex-wrap:wrap;
		justify-content: space-evenly;
		padding: 2%;
        width: 96%;
        height: 100%;
	}
	.leftJustified {
		text-align: left;
		margin-left:10%;
		margin-right:10%;
	}
	.centered {
		text-align: center;
	}
	.verticalCenter {

		align-self:center;

	}

	.testimonials {
		display:block;
		width:80%;
		margin-left:10%;
		border-style:solid;
		border-width:2px;
		border-color:var(--accent);

	}
	button>a{
		text-decoration:none;
		color:white;
	}
</style>
