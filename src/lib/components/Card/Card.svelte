<style>
	.backText {
		color:darkcyan;
		text-align: center;
		
	}

	.frontText {
		text-align: center;	
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
		background-color: darkcyan;
		border-color: #aaa;
		border-style: solid;
		border-width: 5px;
		overflow: hidden;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.back {
		background-color: lightgray;
		border-color: darkcyan;
		border-style: solid;
		border-width: 5px;
	}
</style>

<script>
	export let cardHeight = 200;
	export let cardWidth = 300;

	let flipped = false
	
	function flip(node, {
		delay = 0,
		duration = 1000
	}) {
		return {
			delay,
			duration,
			css: (t, u) => `
				transform: rotateY(${1 - (u * 180)}deg);
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

<div class="card-container" style="position:relative; width: {cardWidth}px; height:{cardHeight}px" tabindex="0" role="cell" on:mouseover={handleMouseOver} on:focus={handleMouseOver} on:mouseout={handleMouseOut} on:blur={handleMouseOut}>
	<div class="card">
		{#if !flipped}
		<div class="side" transition:flip>
			<h2 class="frontText">
				<slot name="content">
					Unknown content
				</slot>
			</h2>
		</div>
		{:else}
		<div class="side back" transition:flip>
			<h2 class="backText">
				<slot name="backContent">
					Unknown back content
				</slot>
			</h2>
		</div>
		{/if}
	</div>
</div>