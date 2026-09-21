<script lang="ts">
	import GameArt from '$lib/components/GameArt.svelte';
	import { games, apps } from '$lib/data/portfolio.js';
</script>

<div class="games-page">
	<header class="page-head">
		<span class="eyebrow">Made for play</span>
		<h1>Games &amp; apps</h1>
		<p class="lead">
			Tools I built for friends, family and myself. The games run in any browser, so iPhone,
			Android and desktop players can share the same table.
		</p>
	</header>

	{#each games as game}
		<article class="card game" id={game.id}>
			<div class="art-wrap">
				<GameArt game={game.id} />
			</div>
			<div class="details">
				<h2>{game.title}</h2>
				<p class="tagline">{game.tagline}</p>
				<p>{game.description}</p>
				<ul class="highlights">
					{#each game.highlights as highlight}
						<li>{highlight}</li>
					{/each}
				</ul>
				<p class="players"><strong>Players:</strong> {game.players}</p>
				<ul class="chips">
					{#each game.stack as tech}
						<li class="chip">{tech}</li>
					{/each}
				</ul>
				<div class="actions">
					<a class="btn-primary" href={game.link} target="_blank" rel="noopener noreferrer"
						>{game.cta} ↗</a
					>
					{#if game.support}
						<a
							class="btn-secondary"
							href={game.support.href}
							target="_blank"
							rel="noopener noreferrer">{game.support.label} ↗</a
						>
					{/if}
				</div>
			</div>
		</article>
	{/each}

	<section class="apps">
		<div class="section-head">
			<span class="eyebrow">In your pocket</span>
			<h2>iPhone apps</h2>
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
	</section>

	<section class="feedback">
		<h2>Found a bug or have an idea?</h2>
		<p>I'd love to hear how the games play for you.</p>
		<a class="btn-secondary" href="/contact#contactForm">Tell me about it</a>
	</section>
</div>

<style>
	.page-head {
		text-align: center;
		margin: 2rem auto 3rem;
		max-width: 40rem;
	}

	.page-head h1 {
		margin: 0.3rem 0 0.75rem;
	}

	.lead {
		color: var(--text-muted);
		font-size: 1.15rem;
		margin: 0;
	}

	.game {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
		padding: 1.5rem;
	}

	.art-wrap {
		align-self: start;
	}

	.art-wrap :global(.art) {
		height: 15rem;
	}

	.details h2 {
		text-align: left;
		margin: 0 0 0.25rem;
	}

	.details .tagline {
		color: var(--mainThemeLighter);
		font-weight: 500;
		margin: 0 0 1rem;
	}

	.details p {
		color: var(--text);
	}

	.highlights {
		margin: 1rem 0;
		padding-left: 1.2rem;
		color: var(--text-muted);
	}

	.highlights li {
		margin-bottom: 0.3rem;
	}

	.players {
		color: var(--text-muted);
		font-size: 0.95rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.apps {
		margin-top: 4rem;
	}

	.app-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.app h3 {
		margin: 0 0 0.5rem;
	}

	.app p {
		color: var(--text-muted);
		font-size: 0.98rem;
		margin: 0 0 1rem;
	}

	.link {
		color: var(--accent);
		font-weight: 600;
	}

	.feedback {
		text-align: center;
		margin-top: 4rem;
		padding: 2.5rem 1.5rem;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius);
		background: var(--surface);
	}

	.feedback h2 {
		margin-top: 0;
	}

	.feedback p {
		color: var(--text-muted);
	}

	@media (min-width: 800px) {
		.game {
			grid-template-columns: 2fr 3fr;
		}

		.game:nth-of-type(even) {
			grid-template-columns: 3fr 2fr;
		}

		.game:nth-of-type(even) .art-wrap {
			order: 2;
		}

		.app-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
