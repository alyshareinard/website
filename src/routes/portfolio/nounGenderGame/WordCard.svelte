<script>
	import { fit, parent_style} from '@leveluptuts/svelte-fit';
	import {slide} from 'svelte/transition';
	export let flipped = false;
	export let background = 'lightgray';


	function flip(node, { delay = 0, duration = 1000 }) {
		return {
			delay,
			duration,
			css: (t, u) => `
				transform: rotateY(${1 - u * 180}deg);
				opacity: ${1 - u};
			`
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
			<div style:background-color={background} class="side" transition:flip>
				<div style={parent_style}>
				<h2 style = "line-height:100%; vertical-align:middle" use:fit={{min_size: 12, max_size:40 }} class="frontText">
					<slot  name="frontContent"/>
				</h2>
				</div>
			</div>
		{:else}
			<div class="side back" transition:flip>
				<div style={parent_style}>
				<h2 style = "line-height:100%; vertical-align:middle" use:fit={{min_size: 12, max_size:32 }} class="backText">
					<slot name="backContent"/>
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
		color: black;
		margin:5%;
	}
	.card-container {
		width: 100px;
		height: 50px;
		position: absolute;

	}

	.card {
		width: 100%;
		height: 100%;
		position: absolute;

		
	}

	.side {
		color: black;

		height: 100%;
		width: 100%;
		border-color: darkgrey;
		border-style: solid;
		border-width: 5px;



	}

	.back {
		background-color: whitesmoke;
		border-color: #d6ccd8;
		color: black;
		border-style: solid;
		border-width: 5px;
	}
</style>
