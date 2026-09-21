<script lang="ts">
	import { projects, games, apps, demos } from '$lib/data/portfolio.js';
</script>

<div class="portfolio">
	<header class="page-head">
		<span class="eyebrow">Work</span>
		<h1>Portfolio</h1>
		<p class="lead">
			Client projects where I replaced manual work with something reliable, plus a few apps and
			demos you can try yourself.
		</p>
	</header>

	<section aria-labelledby="client-work">
		<h2 id="client-work">Selected client projects</h2>
		<div class="project-list">
			{#each projects as project}
				<article class="card project" id={project.slug}>
					<h3>{project.title}</h3>
					<p class="summary">{project.summary}</p>
					<p class="description">{project.description}</p>
					<ul class="chips">
						{#each project.stack as tech}
							<li class="chip">{tech}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>

	<section aria-labelledby="apps-to-explore">
		<h2 id="apps-to-explore">Apps to explore</h2>
		<div class="tile-grid">
			{#each games as game}
				<a class="card tile" href="/games#{game.id}">
					<h3>{game.title}</h3>
					<p>{game.tagline}</p>
					<span class="link">About the game →</span>
				</a>
			{/each}
			{#each apps as app}
				<a class="card tile" href={app.link} target="_blank" rel="noopener noreferrer">
					<h3>{app.title}</h3>
					<p>{app.description}</p>
					<span class="link">{app.cta} ↗</span>
				</a>
			{/each}
			{#each demos as demo}
				<a class="card tile" href={demo.link}>
					<h3>{demo.title}</h3>
					<p>{demo.description}</p>
					<span class="link">Open demo →</span>
				</a>
			{/each}
		</div>
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

	section {
		margin-bottom: 4rem;
	}

	.project-list {
		display: grid;
		gap: 1rem;
	}

	.project {
		scroll-margin-top: 5.5rem;
	}

	.project h3 {
		margin: 0 0 0.4rem;
		font-size: 1.3rem;
	}

	.summary {
		color: var(--accent);
		font-weight: 500;
		margin: 0 0 0.75rem;
	}

	.description {
		color: var(--text-muted);
		font-size: 1rem;
		margin: 0 0 1rem;
	}

	.tile-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.tile {
		display: flex;
		flex-direction: column;
	}

	.tile h3 {
		margin: 0 0 0.5rem;
	}

	.tile p {
		color: var(--text-muted);
		font-size: 0.98rem;
		margin: 0 0 1rem;
		flex-grow: 1;
	}

	.link {
		color: var(--accent);
		font-weight: 600;
	}

	@media (min-width: 700px) {
		.tile-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 960px) {
		.tile-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
