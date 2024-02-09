<script>
	import { fit, parent_style } from '@leveluptuts/svelte-fit';

	export let backgroundColor;
	export let flipped = false;

	function flip(node, { delay = 0, duration = 1000 }) {
		return {
			delay,
			duration,
			css: (t, u) => `
				transform: rotateY(${1 - u * 180}deg);
				opacity: ${1 - u};
			`,
		};
	}

	function handleClick() {
		if ($$slots.backContent) {
			flipped = !flipped;
		}
	}
</script>

<div
	class="card-container"
	tabindex="0"
	role="cell"
	on:click={handleClick}
	on:keypress={handleClick}
>
	<div class="card">
		{#if !flipped}
			<div style:background-color={backgroundColor} class="front">
				<div style={parent_style}>
					<h2
						use:fit={{ min_size: 12, max_size: 20 }}
						class="frontText"
					>
						<slot name="frontContent" />
					</h2>
				</div>
			</div>
		{:else}
			<div class="back" transition:flip>
				<div style={parent_style}>
					<h2
						style="line-height:100%; vertical-align:middle"
						use:fit={{ min_size: 12, max_size: 24 }}
						class="backText"
					>
						<slot name="backContent" />
					</h2>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.backText {
		text-align: center;
		text-justify: center;
		color: black;
	}
	.frontText {
		align-self:center;
		color: black;
		margin: 0%;

	}
	.card-container {
		width: 100%;
		height: 100%;
	}

	.card {
		width: 100%;
		height: 100%;
	}

	.front,
	.back {
		position: absolute;
		width: 100%;
		height: 90%;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
		box-shadow: -1px 1px 3px black;
		align-items: center;
	}
	.front {
		color: black;
		border-color: darkgrey;
		border-style: solid;
		border-width: 5px;
		background-color: grey;
	}

	.back {
		background-color: whitesmoke;
		border-color: #d6ccd8;
		color: black;
		border-style: solid;
		border-width: 5px;
	}
</style>
