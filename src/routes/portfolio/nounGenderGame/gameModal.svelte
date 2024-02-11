<script>
	import { confetti } from '@neoconfetti/svelte';
	import { scale, fly, slide } from 'svelte/transition';
	import drag from '$lib/functions/drag.js';
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { interpolateRgb } from 'd3-interpolate';
	import { flip } from 'svelte/animate';
	import WordCard from './WordCard.svelte';
	import { words } from '$lib/db/words';
	import { onMount } from 'svelte';

	let numWords = 10;
	let unique = {};
	export let toggleGame;
	export let toggleHints;
	export let toggleHowtoPlay;
	export let showSummary;
	let mascBox, femBox;
	let correctWords = [];
	let wrongWords = [];
	let wrongWordsDisplay = [];
	let scoreStore = writable(0);
	let percCorrectStore = writable(0);
	let nextCardVis = false;
	$: backgroundColor = 'purple';
	let wrongAnswer = false;
	const showImage = false;
	let seenWords = [];
	let ansMasVis = false;
	let ansFemVis = false;
	let makeConfetti = false;
	let confettiColor = 'purple';
	$: mybackground = 'lightgray';
	let imagekeys = [];
	let nextWord = null;
	let currentWord = null;
	//load the next two lines after the page loads
	onMount(() => {
		const images = import.meta.glob('/src/lib/nounImages/*.webp', { eager: true, as: 'url' });

		//	console.log(images)
		if (images) {
			imagekeys = Object.keys(images).map((key) => images[key]);
		}

		nextWord = randomWord();
		currentWord = nextWord;
		nextCardVis = true;
	});

	//		eager: true,
	//		query: {
	//			enhanced: true
	//		}
	//		as:url
	//	});

	function refresh() {
		unique = {};
		mybackground = 'lightgray';
	}

	function randomWord() {
		let random = Math.floor(Math.random() * words.length);
		let nextWord = words[random];
		while (seenWords.includes(nextWord)) {
			random = Math.floor(Math.random() * words.length);
			nextWord = words[random];
		}
		seenWords.push(nextWord);
		nextWord.fileName = nextWord.imageFile.split('.')[0];

		nextWord.image = imagekeys.find((key) => key.includes(nextWord.fileName));
		console.log('next imageFile', nextWord.imageFile);
		console.log('next image', nextWord.image);
		return nextWord;
	}

	async function handleCorrect(backgroundColor) {
		confettiColor = backgroundColor;
		wrongAnswer = false;

		correctWords.push(currentWord);

		setTimeout(() => {
			revealColor('lightgray', backgroundColor);
		}, 100);
		await tick();
		setTimeout(() => {
			makeConfetti = true;
		}, 600);
		nextWord = randomWord();
	}

	async function handleIncorrect(backgroundColor) {
		setTimeout(() => {
			revealColor('lightgray', backgroundColor);
		}, 100);

		await tick();
		currentWord.id = wrongWords.length + 1;
		wrongWords.push(currentWord);
		wrongAnswer = true;

		nextWord = randomWord();
	}

	async function revealColor(color1, color2) {
		mybackground = color1;
		let fraction = 0.0;
		for (let i = 0; i < 20; i++) {
			setTimeout(() => {
				fraction = i / 20;

				mybackground = interpolateRgb(color1, color2)(fraction);
			}, 300);
			await tick();
		}
	}

	async function handleDragStop(e) {
		let mascBound = mascBox.getBoundingClientRect();
		let femBound = femBox.getBoundingClientRect();

		if (
			e.detail.x > femBound.left &&
			e.detail.x < femBound.right &&
			e.detail.y > femBound.top &&
			e.detail.y < femBound.bottom
		) {
			nextCardVis = false;
			ansMasVis = false;
			ansFemVis = true;
			await tick();

			currentWord = nextWord;
			if (currentWord.gender == 'F') {
				backgroundColor = 'pink';
				await handleCorrect(backgroundColor);
			} else {
				backgroundColor = 'lightblue';
				await handleIncorrect(backgroundColor);
			}
			setTimeout(() => {
				ansFemVis = false;
				wrongWordsDisplay = wrongWords.slice(-3);
			}, 500);
		} else if (
			e.detail.x > mascBound.left &&
			e.detail.x < mascBound.right &&
			e.detail.y > mascBound.top &&
			e.detail.y < mascBound.bottom
		) {
			nextCardVis = false;
			ansFemVis = false;
			ansMasVis = true;
			currentWord = nextWord;
			if (currentWord.gender == 'M') {
				backgroundColor = 'lightblue';
				await handleCorrect(backgroundColor);
			} else {
				backgroundColor = 'pink';
				await handleIncorrect(backgroundColor);
			}
			setTimeout(() => {
				ansMasVis = false;
				wrongWordsDisplay = wrongWords.slice(-3);
			}, 500);
		}
		await tick();

		setTimeout(() => {
			nextCardVis = true;
		}, 1200);
		await tick();
		setTimeout(() => {
			scoreStore.set(correctWords.length);
			if (correctWords.length + wrongWords.length > 0) {
				percCorrectStore.set(
					Math.round((100 * correctWords.length) / (correctWords.length + wrongWords.length))
				);
			}
		}, 500);
		if (correctWords.length + wrongWords.length >= numWords-1) {
			//delay 3 seconds
			console.log("Correct words: ", correctWords.length, correctWords);
			console.log("Wrong words: ", wrongWords.length, wrongWords);
			console.log("this should delay")
			setTimeout(() => {
				nextCardVis = false;
				confettiColor = ['lightblue', 'pink'];
				makeConfetti = true;
				showSummary = true;
			}, '3000');
		} else {
			refresh();
		}
	}

	function resetConfetti() {
		makeConfetti = false;
	}

	function resetWordList() {
		correctWords = [];
	}

	function wrongInAnimation() {
		const degrees = 360;
		return {
			duration: 200,
			delay: 100,

			css: (u) => `transform: scale(${u}) rotate(${u * degrees}deg);`
		};
	}
	function outAnimation() {
		if (wrongAnswer) {
			const degrees = 360;
			return {
				duration: 200,
				delay: 100,

				css: (t) => `transform: scale(${t}) rotate(${t * degrees}deg);`
			};
		} else {
			return {
				duration: 200,
				delay: 100,

				css: (t) => `transform: fade(${t});`
			};
		}
	}
	function resetGame() {
		showSummary = false;
		wrongWords = [];
		wrongWordsDisplay = [];
		seenWords = [];
		correctWords = [];
		scoreStore.set(0);
		percCorrectStore.set(0);
	}
</script>

<div class="modal">
	<div class="modalEnvelope" transition:fly={{ y: 40 }}>
		<nav>
			<ul>
				<li><button on:click={toggleHowtoPlay}>How to play</button></li>
				<li><button on:click={toggleHints}>Hints</button></li>
				<li><button on:click={toggleGame}>Close</button></li>
			</ul>
		</nav>
		{#if showSummary}
			{#if $percCorrectStore > 80.0}
				<h2>Great job!</h2>
			{:else if $percCorrectStore > 50.0}
				<h2>Not bad!</h2>
			{:else}
				<h2>Better luck next time</h2>
			{/if}
			<h4>You got {correctWords.length} out of {numWords}</h4>
			<h4>{$percCorrectStore}% correct</h4>
			<button on:click={resetGame}>Play again?</button>
		{:else if showImage}
			<enhanced:img src="/src/lib/nounImages/{currentWord.imageFile}" alt={currentWord.ENG} />
		{:else}
			<div bind:this={mascBox} class="answerBoxMasc">
				<div class="helpWordsMasc uncss">Un</div>
				<div class="helpWordsMasc lecss">Le</div>
				<div class="helpWordsMasc aucss">au</div>
				<div class="helpWordsMasc ducss">du</div>
				{#if ansMasVis}
					<div class="answerCardMasc" out:outAnimation>
						<WordCard backgroundColor={mybackground}>
							<div slot="frontContent">
								{currentWord.FR}
							</div>

							<div slot="backContent" />
						</WordCard>
					</div>
				{/if}
			</div>
			<div bind:this={femBox} class="answerBoxFem">
				<div class="helpWordsFem unecss">Une</div>
				<div class="helpWordsFem lacss">La</div>
				<div class="helpWordsFem alacss">à la</div>
				<div class="helpWordsFem delacss">de la</div>
				{#if ansFemVis}
					<div class="answerCardFem" out:outAnimation>
						<WordCard backgroundColor={mybackground}>
							<div slot="frontContent">
								{currentWord.FR}
							</div>
						</WordCard>
					</div>
				{/if}
			</div>

			<div class="scoreBox">
				<h3>
					Score: {$scoreStore}
				</h3>
				<h3>
					{$percCorrectStore}% correct
				</h3>
			</div>

			<div class="wrongWordsBox">
				{#each wrongWordsDisplay as word (word.id)}
					<div
						class="flexWordContainer"
						animate:flip
						in:wrongInAnimation
						out:slide={{ duration: 200, axis: '-x' }}
					>
						<WordCard backgroundColor={word.gender == 'M' ? 'lightblue' : 'pink'}>
							<div slot="frontContent">
								<div class="wordImageContainer">
									<div class="top">
										{word.FR}
									</div>
									<div class="bottom">
										<img src={word.image} alt={word.FR} />
									</div>
								</div>
							</div>

							<div slot="backContent">
								{word.EngWO}
							</div>
						</WordCard>
					</div>
				{/each}
			</div>
			{#if nextCardVis}
				{#key unique}
					<div class="wordContainer" use:drag on:dragStop={handleDragStop}>
						<WordCard backgroundColor="lightgray">
							<div slot="frontContent">
								{nextWord.FrWO}
							</div>
							<div slot="backContent">
								{nextWord.EngWO}
							</div>
						</WordCard>
					</div>
				{/key}
			{/if}

			<div class="centered">
				{#if makeConfetti}
					<div
						on:animationend={resetConfetti}
						style="position: absolute; left: 50%; top: 30%"
						use:confetti={{
							force: 0.5,
							stageWidth: window.innerWidth,
							stageHeight: window.innerHeight,
							colors: [confettiColor]
						}}
					/>
				{/if}

				{#if correctWords.length === 15}
					<div
						on:animationstart={resetWordList}
						style="position: absolute; left: 50%; top: 30%"
						use:confetti={{
							force: 0.9,
							stageWidth: window.innerWidth,
							stageHeight: window.innerHeight,
							colors: ['pink', 'lightblue']
						}}
					/>
				{/if}
			</div>
		{/if}
	</div>
	<div on:click={toggleGame} transition:scale={{ start: 1.5, duration: 1000 }} class="background" />
</div>

<style>
	.centered {
		position: absolute;
		top: 50%;
		left: 50%;
		justify-content: center;
		align-items: center;
	}

	.answerCardFem,
	.answerCardMasc {
		position: absolute;
		width: 40%;
		height: 20%;
		left: 40px;
	}
	.answerCardFem {
		bottom: 60px;
	}

	.answerCardMasc {
		bottom: 40px;
	}

	.wrongWordsBox {
		width: 60%;
		aspect-ratio: 2.5;
		margin-left: 1%;
		margin-right: 1%;
		background: grey;
		position: absolute;
		left: 20%;
		bottom: 10px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: left;
	}

	.modal {
		overflow-y: hidden;
		overflow-x: hidden;
		position: fixed;
		display: flex;
		aspect-ratio: 16/9;
		width: 100%;
		left: 0;
		top: 0;
		align-items: center;
		justify-content: center;
		overscroll-behavior: none;
	}

	.wordContainer {
		width: 20%;
		aspect-ratio: 4;
		position: absolute;
		align-items: center;
		justify-items: center;
		top: 15%;
		left: 40%;
	}
	.wordImageContainer {
		width: 100%;
		height: 100%;
	}

	.flexWordContainer {
		width: 30.8%;
		margin-right: 1%;
		margin-left: 1%;
		margin-top: 1%;
		position: relative;
	}
	.bottom {
		position: absolute;
		bottom: 0;
		z-index: 3;
	}
	.top {
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 4;
		justify-items: center;
		align-items: center;
	}

	.modalEnvelope {
		position: relative;
		text-align: center;
		background: #fff;
		border-radius: 10px;
		height: 60%;
		width: 60%;
		overflow: hidden;
	}
	.background {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		opacity: 0.9;
		background: linear-gradient(142deg, pink 5%, lightblue 100%);
	}

	.answerBoxMasc,
	.answerBoxFem {
		width: 30%;
		height: 40%;
		margin-left: 10px;
		margin-right: 10px;
		position: absolute;
		top: 15%;
	}
	.answerBoxMasc {
		background: lightblue;
	}

	.answerBoxFem {
		background: pink;
		right: 0;
	}
	.helpWordsMasc {
		color: rgb(12, 150, 196);
		font-size: 1.8rem;
		position: relative;
	}
	.uncss {
		top: 8px;
		transform: rotate(13deg);
	}
	.aucss {
		top: -4%;
		left: 25%;
		transform: rotate(41deg);
	}
	.lecss {
		top: 25%;
		right: 20%;
		transform: rotate(-26deg);
	}
	.ducss {
		top: 10%;
		left: -5px;
		transform: rotate(-40deg);
	}

	.lacss {
		top: 25%;
		right: 20%;
		transform: rotate(26deg);
	}
	.alacss {
		top: 0%;
		left: 20%;
		transform: rotate(21deg);
	}
	.delacss {
		top: 10%;
		left: -5px;
		transform: rotate(-20deg);
	}
	.unecss {
		top: 8%;
		transform: rotate(-40deg);
	}
	.helpWordsFem {
		color: rgb(249, 90, 117);
		font-size: 1.8em;
		position: relative;
	}
	.scoreBox {
		position: absolute;
		top: 32%;
		left: 38%;
		width: 24%;
		height: fit-content;
		background: rgb(180, 180, 180);
	}
	h3 {
		margin: 5%;
		color: aliceblue;
	}
	nav {
		display: flex;
		margin-top: 1px;
		justify-content: center;
		--background: var(--mainTheme);
	}
	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
		margin: 2px;
	}
	img {
		width: 90%;
	}

	@media (max-width: 1200px) {
		.modal {
			aspect-ratio: unset;
			height: 100%;
		}
		.modalEnvelope {
			height: 100%;
			width: 100%;
			overflow: hidden;
		}
	}
	@media (max-width:900px){
		.wrongWordsBox {
		width: 50%;
		aspect-ratio: 2.5;
		left: 25%;
	}
}
	@media (max-width: 700px) {
		.answerBoxMasc,
		.answerBoxFem {
			height: 35%;
		}
		.helpWordsFem {
			font-size: 1.5em;
		}
		.helpWordsMasc {
			font-size: 1.5em;
		}
	}
</style>
