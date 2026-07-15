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

	const featuredProjects = [
		{
			title: 'Business Central ↔ VisualFactory',
			description:
				'Built a full automation pipeline using custom AL code and secure API connections to sync assembly orders and parts data between Microsoft Business Central (inventory) and VisualFactory (shop-floor assembly instructions), eliminating manual entry and ensuring accurate, real-time inventory updates across systems.',
			stack: 'Business Central AL, OAuth 2.0, REST APIs',
			link: '/portfolio'
		},
		{
			title: 'VisualFactory → Windchill (FRACAS / NC intake)',
			description:
				'Delivered an automated path from shop-floor issue reporting in VisualFactory into Windchill by standardizing the handoff into Windchill’s FRACAS-compatible import format. Implemented a reliable “generate → deliver → validate → transform → import” pipeline: VisualFactory produces structured defect reports (CSV/XML), routes them through a dedicated Microsoft 365 mailbox, and an internal scheduled automation retrieves and validates attachments via Microsoft Graph, archives processed inputs, transforms them into Windchill-compliant FRACAS XML, and imports them using Windchill’s standard XML import interface—complete with audit logging and secure credential handling.',
			stack: 'VisualFactory, Windchill, Microsoft Graph, Microsoft 365, XML',
			link: '/portfolio'
		},
		{
			title: 'Inventory & payroll system',
			description:
				'Built a full inventory and payroll system for a door-to-door sales business, tracking supplier shipments, rep checkouts, sales, and automated commission calculations with emailed PDF pay stubs.',
			stack: 'Backendless, React, JavaScript',
			link: '/portfolio'
		},
		{
			title: 'Shipping tracker integration',
			description:
				'Created middleware that pulled delivery dates from AfterShip into SKU.io purchase orders, replacing daily manual tracking-number lookups.',
			stack: 'Retool, JavaScript',
			link: '/portfolio'
		},
		{
			title: 'Product reviewer management',
			description:
				'Replaced a manual spreadsheet process with an Airtable-backed system and Streamlit front end so reviewers could log in, see past reviews, and request new products.',
			stack: 'Airtable, Python, Streamlit',
			link: '/portfolio'
		}
	];
</script>

<main>
	<section class="intro">
		<h2>Apps, automations, and integrations for small businesses</h2>
		<p>
			I'm Alysha, an American developer based in Switzerland. I help small teams replace repetitive
			manual work with lightweight, reliable tools that fit their actual workflow.
		</p>
		<a class="cta-button" href="/contact#contactForm">Discuss your project</a>
	</section>

	<section class="services">
		<div class="service-card">
			<h3>Custom Apps</h3>
			<p>Web and desktop tools built for your exact workflow — nothing extra, nothing missing.</p>
		</div>
		<div class="service-card">
			<h3>Automations</h3>
			<p>Reclaim your time by automating repetitive tasks like emails, invoices, and data entry.</p>
		</div>
		<div class="service-card">
			<h3>Integrations</h3>
			<p>Get your tools talking — CRMs, forms, databases, accounting software, and more.</p>
		</div>
	</section>

	<section class="featured-work">
		<div class="text-box">
			<h2>Recent client work</h2>
		</div>
		<div class="project-list">
			{#each featuredProjects as project}
				<a href={project.link} class="project-card">
					<h3>{project.title}</h3>
					<p>{project.description}</p>
					<span class="stack">{project.stack}</span>
				</a>
			{/each}
		</div>
		<a href="/portfolio" class="secondary-link">See the full portfolio &rarr;</a>
	</section>

	{#if showTestimonials}
		<section class="testimonials">
			<h2>What clients say</h2>
			<div class="carousel-container">
				<Carousel
					autoplay
					autoplayDuration={5000}
					infinite={true}
					dots={true}
					arrows={true}
					transitionDuration={800}
				>
					{#each testimonials as testimonial}
						<div class="testimonial-slide">
							<div class="testimonial">
								{#each testimonial.text as line}
									<p>{line}</p>
								{/each}
								{#if testimonial.author}
									<p class="author">- {testimonial.author}</p>
								{/if}
							</div>
						</div>
					{/each}
				</Carousel>
			</div>
		</section>
	{/if}

	<section class="demo-apps">
		<div class="text-box">
			<h2>Explore example apps</h2>
			<p>These are small, self-contained demos of the kinds of tools I build for clients.</p>
		</div>
		<PorfolioCards />
	</section>

	<section class="final-cta">
		<h2>Have a process that needs automating?</h2>
		<p>Tell me about it and let's turn it into a tool that saves you time.</p>
		<a class="cta-button" href="/contact#contactForm">Contact me</a>
	</section>
</main>

<style>
	main {
		justify-content: center;
	}

	section {
		margin-bottom: 2.5rem;
	}

	.intro {
		text-align: center;
		max-width: 800px;
		margin: 0 auto 3rem auto;
		padding: 1.5rem;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 8px;
	}

	.intro h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.intro p {
		font-size: 1.2rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.cta-button {
		display: inline-block;
		background: var(--mainTheme);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 5px;
		text-decoration: none;
		font-weight: 600;
		transition: background 0.2s ease;
	}

	.cta-button:hover {
		background: var(--mainThemeDark);
		color: var(--accent);
	}

	.services {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		padding: 2%;
		width: 96%;
		gap: 1.5rem;
	}
	.service-card {
		background-color: rgba(0, 0, 0, 0.6);
		border: 2px solid var(--accent);
		border-radius: 8px;
		padding: 1.5rem;
		width: 300px;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
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

	.featured-work {
		width: 90%;
		max-width: 1100px;
		margin: 0 auto;
	}

	.featured-work h2 {
		text-align: center;
	}

	.project-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		justify-content: center;
		margin: 1.5rem 0;
	}

	.project-card {
		background-color: var(--accentLight);
		color: var(--mainThemeDark);
		border-radius: 8px;
		padding: 1.5rem;
		width: 320px;
		text-decoration: none;
		transition: transform 0.3s ease;
	}

	.project-card:hover {
		transform: translateY(-5px);
	}

	.project-card h3 {
		color: var(--mainTheme);
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.project-card p {
		color: var(--mainThemeDark);
		font-size: 1rem;
		line-height: 1.5;
		margin: 0 0 0.75rem 0;
	}

	.stack {
		display: inline-block;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--mainThemeDark);
		background: rgba(0, 87, 87, 0.15);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.secondary-link {
		display: block;
		text-align: center;
		margin-top: 1rem;
		font-weight: 600;
	}

	.text-box {
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 8px;
		padding: 1.5rem;
		max-width: 800px;
		margin: 0 auto 1.5rem auto;
		text-align: center;
	}

	.text-box h2,
	.text-box p {
		margin: 0;
	}

	.text-box p {
		margin-top: 0.5rem;
	}

	.final-cta {
		text-align: center;
		padding: 2rem 1rem;
		border: 2px solid var(--accent);
		border-radius: 8px;
		max-width: 800px;
		margin: 0 auto;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.final-cta h2 {
		margin-top: 0;
	}

	.carousel-container {
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.testimonial-slide {
		width: 100%;
		min-height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0;
	}

	.testimonial {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 1.5rem;
		width: 90%;
		max-width: 800px;
		margin: 0 auto;
	}

	.testimonial p {
		margin-bottom: 0.75rem;
		line-height: 1.6;
	}

	.testimonial .author {
		font-style: italic;
		margin-top: 1rem;
		color: var(--accent);
	}

	.testimonials {
		display: block;
		width: 80%;
		margin-left: 10%;
		border-style: solid;
		border-width: 2px;
		border-color: var(--accent);
		padding: 1rem 0;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 8px;
	}

	@media (max-width: 768px) {
		.services,
		.project-list {
			flex-direction: column;
			align-items: center;
		}
		.service-card,
		.project-card {
			width: 85%;
			margin-bottom: 1rem;
		}
	}
</style>
