<script lang="ts">
	import GameArt from '$lib/components/GameArt.svelte';
	import { projects, games, apps, demos, testimonials, shortReviews } from '$lib/data/portfolio.js';

	const toolbox = [
		'Svelte',
		'Python',
		'Airtable',
		'HubSpot',
		'Microsoft Graph',
		'Business Central',
		'Retool',
		'REST APIs',
		'Zapier'
	];
</script>

<div class="home">
	<section class="hero">
		<div class="hero-copy">
			<span class="eyebrow">Apps · Automations · Integrations</span>
			<h1>Small business tech partner</h1>
			<p class="lead">
				I'm Alysha, an American developer based in Switzerland. I help small teams replace
				repetitive manual work with lightweight, reliable tools that fit their actual workflow.
			</p>
			<div class="actions">
				<a class="btn-primary" href="/contact#contactForm">Book a free 30-min discovery call</a>
				<a class="btn-secondary" href="/portfolio">See my work</a>
			</div>
			<p class="story-link">
				<a href="/about">Former solar physicist turned developer: read my story &rarr;</a>
			</p>
		</div>

		<aside class="toolbox card" aria-label="Tools I work with">
			<h2>Tools I work with</h2>
			<ul class="chips">
				{#each toolbox as tool}
					<li class="chip">{tool}</li>
				{/each}
			</ul>
			<p>Based in Switzerland, working with clients worldwide.</p>
		</aside>
	</section>

	<section class="services" aria-label="Services">
		<div class="card service">
			<svg viewBox="0 0 24 24" aria-hidden="true"
				><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></svg
			>
			<h3>Custom apps</h3>
			<p>Web and desktop tools built for your exact workflow. Nothing extra, nothing missing.</p>
		</div>
		<div class="card service">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
			<h3>Automations</h3>
			<p>Reclaim your time by automating repetitive tasks like emails, invoices, and data entry.</p>
		</div>
		<div class="card service">
			<svg viewBox="0 0 24 24" aria-hidden="true"
				><path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0zM12 16v5" /></svg
			>
			<h3>Integrations</h3>
			<p>Get your tools talking: CRMs, forms, databases, accounting software, and more.</p>
		</div>
	</section>

	<section id="work">
		<div class="section-head">
			<span class="eyebrow">Selected work</span>
			<h2>Recent client projects</h2>
		</div>
		<div class="project-grid">
			{#each projects.slice(0, 6) as project}
				<a class="card project" href="/portfolio#{project.slug}">
					<h3>{project.title}</h3>
					<p>{project.summary}</p>
					<ul class="chips">
						{#each project.stack as tech}
							<li class="chip">{tech}</li>
						{/each}
					</ul>
				</a>
			{/each}
		</div>
		<p class="more"><a href="/portfolio">See the full portfolio &rarr;</a></p>
	</section>

	<section id="games">
		<div class="section-head">
			<span class="eyebrow">Made for play</span>
			<h2>Games &amp; apps I've built</h2>
			<p>
				Beyond client work, I build things for my friends and myself. They're also a fair preview of
				how I work: real-time multiplayer, mobile, and polished details.
			</p>
		</div>

		<div class="game-grid">
			{#each games as game}
				<article class="card game">
					<GameArt game={game.id} />
					<h3>{game.title}</h3>
					<p>{game.tagline}</p>
					<a class="btn-primary" href={game.link} target="_blank" rel="noopener noreferrer"
						>{game.cta} ↗</a
					>
				</article>
			{/each}
		</div>

		<div class="app-grid">
			{#each apps as app}
				<a class="card app" href={app.link} target="_blank" rel="noopener noreferrer">
					<h3>{app.title}</h3>
					<p>{app.description}</p>
					<span class="link">{app.cta} ↗</span>
				</a>
			{/each}
		</div>
		<p class="more"><a href="/games">More about the games &rarr;</a></p>
	</section>

	<section>
		<div class="section-head">
			<span class="eyebrow">Try it yourself</span>
			<h2>Small demo tools</h2>
			<p>Self-contained examples of the kinds of tools I build for clients.</p>
		</div>
		<div class="demo-grid">
			{#each demos as demo}
				<a class="card demo" href={demo.link}>
					<h3>{demo.title}</h3>
					<p>{demo.description}</p>
					<span class="link">Open demo →</span>
				</a>
			{/each}
		</div>
	</section>

	<section>
		<div class="section-head">
			<span class="eyebrow">Kind words</span>
			<h2>What clients say</h2>
		</div>
		<div class="quote-grid">
			{#each testimonials as t}
				<figure class="card quote">
					<blockquote>{t.quote}</blockquote>
					<figcaption>
						<strong>{t.author}</strong>
						<span>{t.role}</span>
					</figcaption>
				</figure>
			{/each}
		</div>
		<ul class="short-reviews">
			{#each shortReviews as review}
				<li class="card">“{review}”</li>
			{/each}
		</ul>
	</section>

	<section class="final-cta">
		<h2>Have a process that needs automating?</h2>
		<p>Tell me about it and let's turn it into a tool that saves you time.</p>
		<a class="btn-primary" href="/contact#contactForm">Contact me</a>
	</section>
</div>

<style>
	section {
		margin-top: 4.5rem;
	}

	/* Hero */
	.hero {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		align-items: center;
		margin-top: 2rem;
	}

	.hero h1 {
		text-align: left;
		font-size: clamp(2.4rem, 6vw, 3.8rem);
		margin: 0.4rem 0 1rem;
		background: linear-gradient(120deg, var(--text) 30%, var(--mainThemeLighter));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.lead {
		font-size: 1.2rem;
		color: var(--text-muted);
		max-width: 36rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 1.75rem 0 1rem;
	}

	.story-link {
		font-size: 0.95rem;
		margin: 0;
	}

	.toolbox h2 {
		text-align: left;
		font-size: 1rem;
		margin: 0 0 1rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	.toolbox p {
		font-size: 0.9rem;
		color: var(--text-muted);
		margin: 1rem 0 0;
	}

	/* Services */
	.services {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.service svg {
		width: 2rem;
		height: 2rem;
		fill: none;
		stroke: var(--accent);
		stroke-width: 1.7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.service h3 {
		margin: 0.9rem 0 0.4rem;
	}

	.service p {
		margin: 0;
		color: var(--text-muted);
		font-size: 1rem;
	}

	/* Project cards */
	.project-grid,
	.demo-grid,
	.quote-grid,
	.game-grid,
	.app-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.project {
		display: flex;
		flex-direction: column;
	}

	.project h3,
	.demo h3,
	.app h3,
	.game h3 {
		margin: 0 0 0.5rem;
	}

	.project p,
	.demo p,
	.app p,
	.game p {
		color: var(--text-muted);
		font-size: 0.98rem;
		margin: 0 0 1rem;
		flex-grow: 1;
	}

	.project .chips {
		margin-top: auto;
	}

	.more {
		text-align: center;
		font-weight: 600;
		margin: 1.5rem 0 0;
	}

	/* Games */
	.game {
		display: flex;
		flex-direction: column;
	}

	.game :global(.art) {
		margin-bottom: 1.25rem;
	}

	.game .btn-primary {
		align-self: flex-start;
	}

	.app-grid {
		margin-top: 1rem;
	}

	.app,
	.demo {
		display: flex;
		flex-direction: column;
	}

	.link {
		color: var(--accent);
		font-weight: 600;
	}

	/* Testimonials */
	.quote {
		margin: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1.25rem;
	}

	blockquote {
		margin: 0;
		font-size: 1.02rem;
		line-height: 1.7;
	}

	figcaption {
		display: flex;
		flex-direction: column;
		font-size: 0.92rem;
		color: var(--text-muted);
	}

	figcaption strong {
		color: var(--accent);
		font-family: var(--font-display);
	}

	.short-reviews {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.short-reviews li {
		font-size: 0.98rem;
		color: var(--text-muted);
		font-style: italic;
	}

	/* Final CTA */
	.final-cta {
		text-align: center;
		padding: 3rem 1.5rem;
		border-radius: var(--radius);
		border: 1px solid var(--border-strong);
		background:
			radial-gradient(30rem 15rem at 50% 0%, rgba(0, 130, 130, 0.35), transparent 70%),
			var(--surface);
	}

	.final-cta h2 {
		margin-top: 0;
	}

	.final-cta p {
		color: var(--text-muted);
		margin-bottom: 1.5rem;
	}

	@media (min-width: 700px) {
		.services,
		.demo-grid,
		.short-reviews {
			grid-template-columns: repeat(3, 1fr);
		}

		.project-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.quote-grid,
		.game-grid,
		.app-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 960px) {
		.hero {
			grid-template-columns: 1.4fr 1fr;
			gap: 3rem;
		}

		.project-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
