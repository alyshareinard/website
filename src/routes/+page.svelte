<script lang="ts">
	import { browser } from '$app/environment';
	import Carousel from 'svelte-carousel';
	import PorfolioCards from './portfolioCards.svelte';

	let showTestimonials = $state(false);
	
	$effect(() => {
		if (browser) {
			showTestimonials = true;
		}
	});

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
			front: 'Better RSS feed',
			back: 'Select feeds, prioritize certain words or phrases, see the most relevant stories first.',
			link: '/portfolio/rssFeed'
		}
		/*,
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
			text: [
				' Alysha delivered exceptional work in a short period of time. Her communication skills were excellent and she was very responsive throughout the project. When I went to Alysha with my workflow issue, she was able to suggest multiple ways to help me achieve my goal. Alysha was pleasant to work with and I would gladly hire her for future automation jobs. She would be an excellent choice for any automation projects you may have.'
			],
			author: 'Shane Price, Freelance Web Designer/Developer'
		},
		{
			text: [
				'I have worked with Alysha on three different projects and each time she has met and exceeded expectations. Each project required ingenuity from Alysha and she provided different options and pros/cons for each in order to achieve our desired outcome. Alysha is both easy and enjoyable to work with and I will continue to hire her for future projects.'
			],
			author: 'Allison Pescatore, Marketing Manager, InvestEd'
		},
		{
			text: [
				'Alysha helped us to improve the Airtable process. Recommend!',
				'Alysha was amazing to work with! Very knowledgable and professional.',
				'Knows the info, gets the job done. Highly recommend and will work with again.'
			]
		}
	];
</script>

<main>
	<div class="services">
		<div class="service-card">
			<h3>Custom Apps</h3>
			<p>Lightweight tools built just for you — nothing extra, nothing missing.</p>
		</div>
		<div class="service-card">
			<h3>Automations</h3>
			<p>Reclaim your time by automating repetitive tasks like emails and invoices.</p>
		</div>
		<div class="service-card">
			<h3>Integrations</h3>
			<p>Get your tools talking — CRMs, forms, databases, and more.</p>
		</div>
	</div>
	<div>
		{#if showTestimonials}
			<div class="testimonials">
				<h2>What others say</h2>
				<Carousel
					autoplay
					autoplayDuration={3000}
					infinite={true}
					dots={true}
					arrows={true}
				>
					{#each testimonials as testimonial}
						<div class="testimonial">
							{#each testimonial.text as line}
								<p>{line}</p>
							{/each}
							{#if testimonial.author}
								<p class="author">- {testimonial.author}</p>
							{/if}
						</div>
					{/each}
				</Carousel>
			</div>
		{/if}
	</div>
	<div class="leftJustified">
		<h3 class="darkBackground">
			Do you have tasks you have to repeat over and over? You've looked for a simple app or tool,
			but none exist? Here are some simple examples of apps I've created. See <a href="/portfolio"
				>Portfolio</a
			> for descriptions of more complex apps I've developed for customers.
		</h3>
	</div>
	<PorfolioCards />
	<div class="centered">
		<h2 class="darkBackground">
			Tell me about your app idea and lets turn it into reality! <button
				><a href="/contact#contactForm">Contact me</a></button
			>
		</h2>
	</div>
</main>

<style>
	main {
		justify-content: center;
	}
	.services {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		padding: 2%;
		width: 96%;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	.service-card {
		background-color: var(--surface-1);
		border: 2px solid var(--accent);
		border-radius: 8px;
		padding: 1.5rem;
		width: 300px;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	.service-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
	}
	.service-card h3 {
		color: var(--accent);
		margin-top: 0;
		margin-bottom: 0.75rem;
		font-size: 1.5rem;
	}
	.service-card p {
		margin: 0;
		line-height: 1.5;
		color: var(--text);
	}
	.testimonial {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 1em;
	}
	.leftJustified {
		text-align: left;
		margin-left: 10%;
		margin-right: 10%;
	}
	.centered {
		text-align: center;
	}
	.testimonials {
		display: block;
		width: 80%;
		margin-left: 10%;
		border-style: solid;
		border-width: 2px;
		border-color: var(--accent);
		margin-top: 2rem;
	}
	button > a {
		text-decoration: none;
		color: white;
	}
	
	@media (max-width: 768px) {
		.services {
			flex-direction: column;
			align-items: center;
		}
		.service-card {
			width: 85%;
			margin-bottom: 1rem;
		}
	}
</style>
