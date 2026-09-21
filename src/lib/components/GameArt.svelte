<script lang="ts">
	let { game }: { game: string } = $props();
</script>

<div class="art {game}" aria-hidden="true">
	{#if game === 'mahjong'}
		<span class="tile t1"><b class="red">中</b></span>
		<span class="tile t2"><b class="green">發</b></span>
		<span class="tile t3"><b class="blue">三<br />萬</b></span>
	{:else if game === 'keesh'}
		<span class="playing c1"><b>9</b><i>9</i></span>
		<span class="playing c2 back"></span>
		<span class="playing c3"><b>4</b><i>4</i></span>
	{/if}
</div>

<style>
	.art {
		position: relative;
		height: 11rem;
		border-radius: var(--radius);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		isolation: isolate;
	}

	.art.mahjong {
		background: radial-gradient(circle at 30% 20%, #1f8f6a, #0d4a3a 70%);
	}

	.art.keesh {
		background: radial-gradient(circle at 70% 20%, #0f6f75, #0a3038 70%);
	}

	/* Mahjong tiles */
	.tile {
		width: 4.2rem;
		height: 5.6rem;
		margin: 0 -0.35rem;
		border-radius: 0.6rem;
		background: linear-gradient(#fbf7ea, #ece5cf);
		box-shadow:
			0 0.4rem 0 #1b7a58,
			0 0.9rem 1.2rem rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Noto Serif CJK SC', 'Songti SC', 'PingFang SC', 'Hiragino Mincho ProN', serif;
		transition: transform 0.3s ease;
	}

	.tile b {
		font-size: 2.6rem;
		line-height: 1;
		text-align: center;
	}

	.tile .red {
		color: #c8322f;
	}
	.tile .green {
		color: #1f8a4c;
	}
	.tile .blue {
		color: #244b9a;
		font-size: 1.7rem;
		line-height: 1.15;
	}

	.t1 {
		transform: rotate(-8deg) translateY(0.3rem);
	}
	.t2 {
		transform: translateY(-0.4rem);
		z-index: 2;
	}
	.t3 {
		transform: rotate(8deg) translateY(0.3rem);
	}

	/* Playing cards */
	.playing {
		width: 4.6rem;
		height: 6.4rem;
		margin: 0 -0.3rem;
		border-radius: 0.6rem;
		background: #fbfaf5;
		box-shadow: 0 0.8rem 1.2rem rgba(0, 0, 0, 0.4);
		position: relative;
		transition: transform 0.3s ease;
		font-family: var(--font-display);
	}

	.playing b {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 2.6rem;
		color: #c8322f;
	}

	.playing i {
		position: absolute;
		top: 0.35rem;
		left: 0.5rem;
		font-style: normal;
		font-weight: 700;
		font-size: 0.95rem;
		color: #c8322f;
	}

	.c3 b,
	.c3 i {
		color: #0f6f75;
	}

	.playing.back {
		background:
			repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.18) 0 6px, transparent 6px 12px),
			linear-gradient(#ffa55a, #e8843a);
		border: 0.3rem solid #fbfaf5;
		z-index: 2;
	}

	.c1 {
		transform: rotate(-12deg) translate(-0.4rem, 0.4rem);
	}
	.c2 {
		transform: translateY(-0.5rem);
	}
	.c3 {
		transform: rotate(12deg) translate(0.4rem, 0.4rem);
	}
</style>
