<script lang="ts">
	import { Card } from '$lib/components/Card';
	import Carousel from 'svelte-carousel';
	let showTestimonials=false
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

	const testimonials = [
		{
			text: "Alysha was able to use her initiative from day one to develop a plan to solve my client's process issue. On my Airtable project, Alysha delivered exceptional work in a short period of time. Her communication skills were excellent and she was very responsive throughout the project. When I went to Alysha with my workflow issue, she was able to suggest multiple ways to help me achieve my goal. As the project developed she was happy to take on additional changes and complete them in a timely fashion. Alysha was pleasant to work with and I would gladly hire her for future automation jobs. She would be an excellent choice for any automation projects you may have.",
			author: 'Shane Price, Freelance Web Designer/Developer'
		},
		{
			text: 'I have worked with Alysha on three different projects and each time she has met and exceeded expectations. Each project required ingenuity from Alysha and she provided different options and pros/cons for each in order to achieve our desired outcome. Alysha is both easy and enjoyable to work with and I will continue to hire her for future projects.',
			author: 'Allison Pescatore, Marketing Manager, InvestEd'
		},
		{
			text: '"Alysha helped us to improve the Airtable process. Recommend!" "Alysha was amazing to work with! Very knowledgable and professional." "Great Hubspot technician for a workflow. Knows the info, gets the job done. Highly recommend and will work with again."'
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
					
			{/each}
		</div>

		<div>
			{#if showTestimonials}
		<Carousel autoplay autoplayDuration={2000}>
			{#each testimonials as testimonial}
				<div>
					<h3>"{testimonial.text}"</h3>
					{#if testimonial.author}
						<h4>{testimonial.author}</h4>
					{/if}
				</div>
			{/each}
		</Carousel>
		{/if}
	</div>
		<p>
			Do you have tasks you have to repeat over and over? You've looked for a simple app, but none
			exist? Here are some examples of apps I've created.
		</p>

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
	main {
		justify-content: center;
	}
	body {
		background: transparent;
	}
	.mainNav {
		display: grid;
		justify-content: center;
		justify-items: center;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		grid-auto-rows: 225px;
		padding: 2%;
		width: 96%;
		height: 100%;
	}
	.portfolioNav {
		width: 96%;
		padding: 2%;
		display: grid;
		justify-content: center;
		justify-items: center;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		grid-auto-rows: 175px;
	}
	.divnopad {
		padding: 0px;
		margin: 0;
	}
</style>
