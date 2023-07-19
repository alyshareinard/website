<script>
    import { confetti } from '@neoconfetti/svelte';
    import { scale, fly } from 'svelte/transition';
    import drag from "$lib/functions/drag.js";


    //import {correctWords} from "./stores.js"
    export let toggleGame;
    let mascBox, femBox;

    import WordCard from './WordCard.svelte';

    $: wordSize="wordSizeSmall"
    $: confetti_blue = false;
	$: confetti_pink = false;
    $: wrongAnswer = false;
	let correctWords = [];
	import { words} from '$lib/db/words';

	let nextWord = randomWord();


	function randomWord() {
        let random = Math.floor(Math.random() * words.length);

        let nextWord=words[random]
        console.log(words[random])

    return nextWord;
}

function handleDragStop(e) {
    console.log(e.detail.x)
    console.log(e.detail.y)
    let mascBound = mascBox.getBoundingClientRect();
    let femBound = femBox.getBoundingClientRect();
    console.log(nextWord)
    if(e.detail.x> femBound.left && e.detail.x<femBound.right && e.detail.y>femBound.top && e.detail.y<femBound.bottom){
        if (nextWord.gender == "F") {
            console.log("correct!")
            confetti_pink=true
            correctWords.push(nextWord) 
            nextWord = randomWord();
            
        } else {
            wrongWords.push(nextWord)
            wrongAnswer=true
            console.log("incorrect!")
//            nextWord = randomWord();
        }
    }else if(e.detail.x> mascBound.left && e.detail.x<mascBound.right && e.detail.y>mascBound.top && e.detail.y<mascBound.bottom){
        if (nextWord.gender == "M") {
            console.log("correct!")
            correctWords.push(nextWord)
            confetti_blue=true
            nextWord  = randomWord();
            
        } else {
            wrongWords.push(nextWord)
            wrongAnswer=true
            console.log("incorrect!")
//            nextWord = randomWord();
        } 
    } else {
        console.log("go back to start");
    }
    console.log(confetti_blue, confetti_pink)
    
    correctWords = correctWords;
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
	<div class="modalEnvelope" transition:fly={{y: 40}}>
		<button on:click={toggleGame}>X</button>
		<div bind:this={mascBox} class="answerBoxMasc" />
		<div bind:this={femBox} class="answerBoxFem" />

        <div class="wordContainer" use:drag on:dragStop={handleDragStop}>
        <WordCard background="#d6ccd8">
            <div class={wordSize} slot="frontContent">
                {nextWord.FrWO}
            </div>
        </WordCard>
        </div>

		<div class="centered">
			{#if confetti_blue}
                <div on:animationend={resetConfetti} style="position: absolute; left: 50%; top: 30%"
                use:confetti={{
                    force: 0.5,
                    stageWidth: window.innerWidth,
                    stageHeight: window.innerHeight,
                    colors: ['lightblue']
                }}
                />
			{/if}

			{#if confetti_pink}
            <div on:animationend ={resetConfetti} style="position: absolute; left: 50%; top: 30%"
                use:confetti={{
                force: 0.5,
                stageWidth: window.innerWidth,
                stageHeight: window.innerHeight,
                colors: ['pink'] 
            }}
            />
            {/if}

            {#if correctWords.length===15}
                <div on:animationstart={resetWordList} style="position: absolute; left: 50%; top: 30%"
                    use:confetti={{
                    force: 0.9,
                    stageWidth: window.innerWidth,
                    stageHeight: window.innerHeight,
                    colors: ['pink', 'lightblue']
                }}
                />

			{/if}
		</div>
		<div class="correctContainer">
			{#each correctWords as word}
				{#if word.gender==="M"}
					<WordCard background="lightblue" flipped=false>
						<div class={wordSize} slot="frontContent">
							{word.FR}
						</div>

						<div slot="backContent">
							{word.EngWO}
						</div>
					</WordCard>
				{:else}
					<WordCard background="pink" flipped=false>
						<div class={wordSize} slot="frontContent">
							{word.FR}
						</div>

						<div slot="backContent">
							{word.EngWO}
						</div>
					</WordCard>
				{/if}
			{/each}
		</div>
	</div>
	<div on:click={toggleGame} transition:scale={{ start: 1.5, duration: 1000 }} class="background" />
</div>

<style>
    .centered{
        position: absolute;
        top: 50%;
        left: 50%;
        justify-content: center;
        align-items: center;
    }
    .answerBoxMasc {
        width: 30%;
        height: 30%;
        margin-left:10px;
        margin-right:10px;
        background: lightblue;
        position: absolute;
        top:2%;
    }
    .answerBoxFem {
        width: 30%;
        height: 30%;
        margin-left:10px;
        margin-right:10px;
        background: pink;
        position: absolute;
        right: 0;
        top:2%;
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
        width: 30%;
        height: 10%;
        position: absolute;
        top:10%;
        left:40%
    }

    .correctContainer {
        display:flex;
        background:grey;
        width: 96%;
        height: 40%;
        position:absolute;
        flex-direction: row;
        flex-wrap:wrap;
        align-items: left;
        top:58%;
        left:2%
    }

    .modalEnvelope {
        position: relative;
        text-align: center;
        background: #fff;
        border-radius: 10px;
        height: 80%;
        width:60%;
    }
    .background {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.9;
        background: linear-gradient(142deg, pink 5%, lightblue 100%);
    }
    .wordsizeLarge{
        font-size: 1em;
    }
    .wordsizeSmall{
        font-size: 0.5em;
    }

</style>
