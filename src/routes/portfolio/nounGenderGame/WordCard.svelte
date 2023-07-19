<style>
	.backText {
		text-align: center;
		color:black;
		
	}
	.frontText{
		text-align: center;
		color:black;
	}
	.card-container {
		width: 100px;
		height: 50px;
		position: relative;
		margin:2%;
	}
	
	.card {
		width: 100%;
		height: 100%;
		position: absolute;
		perspective: 600;
	}
	
	.side {
		color: black;
		position: absolute;
		height: 100%;
		width: 100%;
		border-color: darkgrey;
		border-style: solid;
		border-width: 5px;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.back {
		background-color: whitesmoke;
		border-color:#d6ccd8;
		color:black;
		border-style: solid;
		border-width: 5px;
	}
</style>

<script>
	let flipped = false;
	export let background="lightgray";
	
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

	function handleClick() {
		if ($$slots.backContent){
			flipped = !flipped;
		}
	}
</script>

<div class="card-container" tabindex="0" role="cell" on:click={handleClick} on:keypress={handleClick}>
	<div class="card">
		{#if !flipped}
		<div style:background-color={background} class="side" transition:flip>
			<h2 class="frontText">
				<slot name="frontContent">
					Unknown contents
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
