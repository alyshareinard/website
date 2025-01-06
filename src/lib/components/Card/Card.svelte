<script lang="ts">
	/**
	 * @typedef {Object} Props
	 * @property {number} [cardHeight]
	 * @property {number} [cardWidth]
	 * @property {import('svelte').Snippet} [content]
	 * @property {import('svelte').Snippet} [backContent]
	 */

	/** @type {Props} */
	let { cardHeight = 200, cardWidth = 300, content, backContent } = $props();

	let flipped = $state(false);

	function flip(node: HTMLElement, { delay = 0, duration = 1000 }) {
		return {
			delay,
			duration,
			css: (t: number, u: number) => `
				transform: rotateY(${1 - u * 180}deg);
				opacity: ${1 - u};
			`
		};
	}

	function handleMouseOver() {
		flipped = true;
	}
	function handleMouseOut() {
		flipped = false;
	}
</script>

<div
	class="card-container"
	style="position:relative; width: {cardWidth}px; height:{cardHeight}px"
	tabindex="0"
	role="menuitem"
	onmouseover={handleMouseOver}
	onfocus={handleMouseOver}
	onmouseout={handleMouseOut}
	onblur={handleMouseOut}
>
	<div class="card">
		{#if !flipped}
			<div class="side" transition:flip>
				<h2 class="frontText">
					{#if content}
					{@render content()}
					{:else}
					Unknown content
					{/if}
				</h2>
			</div>
		{:else}
			<div class="side back" transition:flip>
				<h2 class="backText">
					{#if backContent}
					{@render backContent()}
					{:else}Unknown back content{/if}
				</h2>
			</div>
		{/if}
	</div>
</div>

<style>
	.backText {
		color: var(--mainTheme);
		text-align: center;
		padding: 5px;
	}

	.frontText {
		text-align: center;
		padding: 5px;
	}

	.card {
		width: 100%;
		height: 100%;
		position: absolute;
		perspective: 600;
	}

	.side {
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: var(--mainTheme);
		border-color: #fff;
		border-style: solid;
		border-width: 5px;
		overflow: hidden;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.back {
		background-color: #fff;
		border-color: var(--mainTheme);

		border-style: solid;
		border-width: 5px;
	}
	h2 {
		color: #fff;
	}
</style>
