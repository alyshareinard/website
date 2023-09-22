<script>
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import {interpolateRgb} from "d3-interpolate";
	import { tweened } from 'svelte/motion';

	
	export let backgroundColor;
	export let flipped = false;
	/*
	export let showGender = 'show';
	let neutralColor = 'lightgray';
	let genderedColor = '';
$:	if (gender == 'F') {
		genderedColor = 'pink'	
	} else {
		genderedColor = 'lightBlue'
	}
	let newColor='lightgray'
	// we either hide the gender/color (in the question box), reveal it (in the fem/masc boxes) or show it (in the wrong answers box)
	console.log("showGender is: ", showGender);
	let startColor=''
	if (showGender == 'yes') {
		console.log("I should be showing the gender");
		startColor=genderedColor
		newColor=genderedColor

	} else if (showGender == 'no') {
		console.log("I should be hiding the gender");
		startColor=neutralColor
		newColor=neutralColor

	} else {
		console.log("I should be revealing the gender");
		startColor=neutralColor
		newColor=genderedColor
	}
	background=tweened(startColor,{delay: 0, duration: 100, interpolate: interpolateRgb});
	$: background.set(
		newColor,
		{ duration: 500, delay: 0 },
		);
	console.log("background", background)
	console.log("background length", background.length)
	console.log("d3 ", interpolateRgb("lightgrey", "pink")(0.5))
*/
	function flip(node, { delay = 0, duration = 1000 }) {
		console.log('in flip');
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
	on:touchstart={handleClick}
>
	<div class="card">
		{#if !flipped}

				<div style:background-color={backgroundColor} class="front">
					<div style={parent_style}>
						<h2
							style="line-height:100%; vertical-align:middle"
							use:fit={{ min_size: 12, max_size: 32 }}
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
						use:fit={{ min_size: 12, max_size: 32 }}
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
		color: black;
		margin: 5%;
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
		height: 100%;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
		box-shadow: -1px 1px 3px black;
	}
	.front {
		color: black;
		border-color: darkgrey;
		border-style: solid;
		border-width: 5px;
		background-color:grey;
	}

	.back {
		background-color: whitesmoke;
		border-color: #d6ccd8;
		color: black;
		border-style: solid;
		border-width: 5px;
	}
</style>
