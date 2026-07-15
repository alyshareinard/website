<script>
	import { portfolio_cards } from '$lib/data/portfolio.js';
</script>

<div class="portfolioNav">
	{#each portfolio_cards as card}
		<a
			href={card.link}
			class="card"
			target={card.external ? '_blank' : undefined}
			rel={card.external ? 'noopener noreferrer' : undefined}
		>
			<h3>{card.front}</h3>
			<p>{card.back}</p>
			<span class="link">{card.cta ?? 'View project'} {card.external ? '↗' : '→'}</span>
		</a>
	{/each}
</div>

<style>
	.portfolioNav {
		width: 96%;
		padding: 2%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		gap: 1.5rem;
	}
	.card {
		background-color: rgba(0, 0, 0, 0.75);
		border: 2px solid var(--accent);
		border-radius: 8px;
		padding: 1.5rem;
		width: 260px;
		min-height: 160px;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: var(--accentLight);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
	}
	.card h3 {
		color: var(--accent);
		margin: 0 0 0.75rem 0;
		font-size: 1.3rem;
	}
	.card p {
		margin: 0 0 1rem 0;
		line-height: 1.5;
		flex-grow: 1;
	}
	.link {
		color: var(--accent);
		font-weight: 600;
	}

	@media (max-width: 480px) {
		.portfolioNav {
			width: 100%;
			padding: 0;
		}
		.card {
			width: 100%;
			min-height: auto;
		}
	}
</style>
