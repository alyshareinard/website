<script>
	import GameModal from './gameModal.svelte';

	import leChat from '$lib/nounImages/leChat.webp';
	import uneHorlage from '$lib/nounImages/uneHorlage.webp';
	import Hints from './hints.svelte';
	import HowtoPlay from './howToPlay.svelte';

	let isGameOpen = $state(false);
	let showHints = $state(false);
	let showHowtoPlay = $state(false);

	function toggleGame() {
		isGameOpen = !isGameOpen;
	}
	function toggleHints() {
		console.log('toggling hints!!');
		showHints = !showHints;
	}
	function toggleHowtoPlay() {
		showHowtoPlay = !showHowtoPlay;
	}
	if (!isGameOpen) {
		showHints = false;
		showHowtoPlay = false;
	}
</script>

<h2>Nouns have gender?!</h2>
<div class="container">
	<img class="blueborder" src={leChat} alt="cat with beret and mustache" />

	<p class="darkBackground" style="width:75%">
		As a native English speaker, learning French as an adult has not been easy -- One thing I find
		particularly difficult is noun gender. A table has a gender? Un chat (a cat) is masculine, but
		une horloge (a clock) is feminine? What madness is this?
	</p>
	<br />
	<br />
	<p class="darkBackground" style="width:75%">
		A good way to remember the genders of nouns is to hyper-exaggerate the gender -- imagine a
		french cat with a mustache every time you think of a cat and think of every clock as a pink
		princess clock.
	</p>
	<br />
	<br />
	<img class="pinkborder" src={uneHorlage} alt="pink clock" />

	<p class="darkBackground" style="width:75%">
		What I needed was a game to help me drill noun genders, but I couldn't find one.
	</p>
	<br />
	<br />
	<p class="darkBackground" style="width:75%">
		So I created this game with pink and blue boxes for the "boy" nouns and the "girl" nouns. Just
		drag the words to the correct box and see how you do.
	</p>
</div>

<div class="centerStartButton"><button onclick={toggleGame}>start game</button></div>

{#if isGameOpen}
	<GameModal {toggleGame} {toggleHints} {toggleHowtoPlay} />
{/if}

{#if showHints}
	<Hints {toggleHints} />
{/if}

{#if showHowtoPlay}
	<HowtoPlay {toggleHowtoPlay} />
{/if}

<style>
	.centerStartButton {
		display: flex;
		width: 100%;
		justify-content: center;
		padding: 10px;
	}
	.container {
		display: relative;
		margin-left: 20px;
	}
	p {
		display: inline;
	}
	h2 {
		text-align: center;
	}

	.blueborder {
		float: right;
		width: 25%;
		border: 5px solid lightblue;
		max-width: 200px;
		margin: 10px;
		top: 10px;
	}
	.pinkborder {
		float: left;
		border: 5px solid pink;
		width: 25%;
		max-width: 170px;
		margin-right: 10px;
	}
</style>
