<script>
	import { confetti } from '@neoconfetti/svelte';
	import { scale, fly, fade } from 'svelte/transition';
	import drag from '$lib/functions/drag.js';
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
    let unique = {}
	//import {correctWords} from "./stores.js"
	export let toggleGame;
	let mascBox, femBox;
    let percCorrect=0;
    let score=0;

	$: ansMasVis=false;
	$: ansFemVis=false;
	let nextCardVis=true;
	$:flippedCardFem=true;
	$:flippedCardMasc=true;
	$:femBackgroundColor="pink";
	$:mascBackgroundColor="lightblue";

	import WordCard from './WordCard.svelte';

	$: confetti_blue = false;
	$: confetti_pink = false;
	$: wrongAnswer = false;
	let correctWords = [];
    let wrongWords = [];
	import { words } from '$lib/db/words';

    $: if (correctWords.length>0){
        score = correctWords.length;
        percCorrect=Math.round(100*correctWords.length/(correctWords.length + wrongWords.length));
    } else {
        score=0;
        percCorrect=0;
    }
	let nextWord = randomWord();
	let currentWord=nextWord;

    function refresh(){
        unique = {}
    }
	function randomWord() {
		let random = Math.floor(Math.random() * words.length);

		let nextWord = words[random];
		console.log(words[random]);

		return nextWord;
	}

	function handleDragStop(e) {

		console.log(e.detail.x);
		console.log(e.detail.y);
		let mascBound = mascBox.getBoundingClientRect();
		let femBound = femBox.getBoundingClientRect();
		flippedCardFem=true;
		flippedCardMasc=true;
		console.log(nextWord);
		if (
			e.detail.x > femBound.left &&
			e.detail.x < femBound.right &&
			e.detail.y > femBound.top &&
			e.detail.y < femBound.bottom
		) {
			nextCardVis=false
			ansFemVis=true
			currentWord=nextWord;
			if (currentWord.gender == 'F') {
				console.log('correct!');
				
				correctWords.push(currentWord);
				nextWord = randomWord();
				femBackgroundColor="pink";
				
				setTimeout(()=> {flippedCardFem=false; confetti_blue = true;}, 600)
			} else {
				wrongWords.push(currentWord);
				if (wrongWords.length>3) {
					wrongWords.shift()
				}
				wrongAnswer = true;
				console.log('incorrect!');
				nextWord = randomWord();
				femBackgroundColor="lightblue";
				
				setTimeout(()=> {flippedCardFem=false;}, 600)
			}
		} else if (
			e.detail.x > mascBound.left &&
			e.detail.x < mascBound.right &&
			e.detail.y > mascBound.top &&
			e.detail.y < mascBound.bottom
		) {

			nextCardVis=false
			ansMasVis=true
			currentWord=nextWord;
			if (currentWord.gender == 'M') {
				console.log('correct!');
				correctWords.push(currentWord);
				
				nextWord = randomWord();
				mascBackgroundColor="lightblue"
				setTimeout(()=> {flippedCardMasc=false; confetti_blue = true;}, 600)
			} else {
				wrongWords.push(currentWord);
				wrongAnswer = true;
				console.log('incorrect!');
				nextWord = randomWord();
				mascBackgroundColor="pink"
				setTimeout(()=> {flippedCardMasc=false;}, 600)

			}
		}
		nextCardVis=true
		setTimeout(() => {ansMasVis=false; ansFemVis=false; flippedCardMasc=true; flippedCardFem=true;}, 1200);
		
        refresh()

		correctWords = correctWords;
        wrongWords=wrongWords;
        console.log(wrongWords)
        

	}

	function resetConfetti() {
		confetti_blue = false;
		confetti_pink = false;
	}

	function resetWordList() {
		correctWords = [];
	}
</script>

<div class="modal">
	
	<div class="modalEnvelope" transition:fly={{ y: 40 }}>
		
		<nav ><ul>
			<li><button on:click={toggleGame}> How to play </button></li>
			<li><button on:click={toggleGame}> Hints </button></li>
			<li><button on:click={toggleGame}> Close </button></li>
		</ul></nav>
		<div bind:this={mascBox} class="answerBoxMasc" >
            <div class=helpWordsMasc style="top:10px; transform:rotate(13deg)">Un</div>
            <div class=helpWordsMasc style="top:15px; left:-50px; transform:rotate(-26deg)">Le</div> 
            <div class=helpWordsMasc style="bottom: 10px; left:45px; transform:rotate(41deg)">au</div> 
            <div class=helpWordsMasc style="bottom:8px; left:-5px; transform:rotate(-40deg)">du</div> 
			{#if ansMasVis}
				<div class=answerCardMasc out:fade={{ delay: 2500, duration: 3000 }}>
					<WordCard flipped = {flippedCardMasc} background={mascBackgroundColor}>
						<div slot="frontContent">
							{currentWord.FR}
						</div>

						<div slot="backContent">
						</div>
					</WordCard>
				</div>
			{/if}
		</div> 
		<div bind:this={femBox} class="answerBoxFem" >
            <div class=helpWordsFem style="top:10px; transform:rotate(-40deg)">Une</div>
            <div class=helpWordsFem style="top:15px; left:-50px; transform:rotate(26deg)">La</div> 
            <div class=helpWordsFem style="bottom: 14px; left:45px; transform:rotate(21deg)">à la</div> 
            <div class=helpWordsFem style="bottom:8px; left:-5px; transform:rotate(-20deg)">de la</div> 
			{#if ansFemVis}
			<div class=answerCardFem out:fade={{ delay: 2500, duration: 3000 }}>
                <WordCard bind:flipped = {flippedCardFem} background={femBackgroundColor}>
                    <div slot="frontContent">
                        {currentWord.FR}
                    </div>

                    <div slot="backContent">
                    </div>
                </WordCard>
		</div>
		{/if}
        </div>

        <div class=scoreBox>
            <h3>
            Score: {score}
            <br>
            {percCorrect}% correct
            </h3>
        </div>


        <div class=wrongWords>

        {#each wrongWords as word}
            {#if word.gender === 'M'}
			<div class="flexWordContainer">
                <WordCard background="lightblue">
                    <div slot="frontContent">
                        {word.FR}
                    </div>

                    <div slot="backContent">
                        {word.EngWO}
                    </div>
                </WordCard>
			</div>
            {:else}
			<div class="flexWordContainer">
                <WordCard background="pink">
                    <div slot="frontContent">
                        {word.FR}
                    </div>

                    <div slot="backContent">
                        {word.EngWO}
                    </div>
                </WordCard>
			</div>
            {/if}
        {/each}
        </div>
        {#key unique}
		<div class="wordContainer" use:drag on:dragStop={handleDragStop}>
			<WordCard background="#d6ccd8">
				<div slot="frontContent">
						{nextWord.FrWO}
				</div>
			</WordCard>
		</div>
        {/key}



		<div class="centered">
			{#if confetti_blue}
				<div
					on:animationend={resetConfetti}
					style="position: absolute; left: 50%; top: 30%"
					use:confetti={{
						force: 0.5,
						stageWidth: window.innerWidth,
						stageHeight: window.innerHeight,
						colors: ['lightblue']
					}}
				/>
			{/if}

			{#if confetti_pink}
				<div
					on:animationend={resetConfetti}
					style="position: absolute; left: 50%; top: 30%"
					use:confetti={{
						force: 0.5,
						stageWidth: window.innerWidth,
						stageHeight: window.innerHeight,
						colors: ['pink']
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
	.answerBoxMasc {
		width: 30%;
		height: 50%;
		margin-left: 10px;
		margin-right: 10px;
		background: lightblue;
		position: absolute;
		top: 10%;
	}

	.answerBoxFem {
		width: 30%;
		height: 50%;
		margin-left: 10px;
		margin-right: 10px;
		background: pink;
		position: absolute;
		right: 0;
		top: 10%;
	}
	.answerCardFem {
		position:absolute;
		bottom:60px;
		left:40px;
	}
	.answerCardMasc {
		position:absolute;
		bottom:40px;
		left:40px;
	}

    .wrongWords {
		width: 60%;
		height: 20%;
		margin-left: 1%;
		margin-right: 1%;
		background: grey;
		position: absolute;
		left: 20%;
		bottom: 10%;
        display:flex;
        flex-direction: row;
		flex-wrap: wrap;
		align-items: left;
	}

	.modal {
		position: fixed;
		display: flex;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		align-items: center;
		justify-content: center;
	}

	.wordContainer {
        width: 20%;
		height: 10%;
		position: absolute;
		top: 15%;
		left: 42%;
	}
	.flexWordContainer {
        width: 29%;
		height: 80%;
		margin-right:3%;
		margin-left:1%;
		margin-top:1%;
		position:relative;
	}

	.modalEnvelope {
		position: relative;
		text-align: center;
		background: #fff;
		border-radius: 10px;
		height: 60%;
		width: 60%;
	}
	.background {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		opacity: 0.9;
		background: linear-gradient(142deg, pink 5%, lightblue 100%);
	}
    .helpWordsMasc { 
        color:rgb(12, 150, 196);
        font-size: 2rem;
        position:relative;
    }
    .helpWordsFem { 
        color:rgb(249, 90, 117);
        font-size: 2em;
        position:relative;
    }
    .scoreBox {
        position:absolute;
        top: 40%;
		left: 40%;
        width: 20%;
        height: 20%;
        background: violet;
        
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
		margin:2px;
		
	}
</style>
