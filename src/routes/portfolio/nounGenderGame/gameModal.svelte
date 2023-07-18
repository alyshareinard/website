<script>

import { scale, fly } from 'svelte/transition';
import drag from "$lib/functions/drag.js";
import { Confetti } from "svelte-confetti"
//import {correctWords} from "./stores.js"
export let toggleGame;
let mascBox, femBox;
import { words} from '$lib/db/words';
import {WordCard} from '$lib/components/WordCard';

let correctWords = [];
let confetti_blue = false;
let confetti_pink = false;

let nextWord = randomWord();
function randomWord() {
    let random = Math.floor(Math.random() * words.length);
    console.log(words[random])
    return words[random];
}

</script>

<div class="modal">
	<div class="modalEnvelope" transition:fly={{y: 40}}>
		<button on:click={toggleGame}>X</button>
		<div bind:this={mascBox} class="answerBoxMasc" />
		<div bind:this={femBox} class="answerBoxFem" />

		<div use:drag on:dragStop={handleDragStop} class="wordContainer">
			<WordCard use:drag on:dragStop={handleDragStop} background="violet">
				<div slot="frontContent">
					{nextWord.FrWO}
				</div>

				<div slot="backContent">
					{nextWord.EngWO}
				</div>
			</WordCard>
		</div>

		<div class="centered">
			{#if confetti_blue}
				<Confetti colorArray={["lightblue"]} />
			{/if}
			{#if confetti_pink}
				<Confetti colorArray={["pink"]} />
			{/if}
			<script>
            confetti_blue=false;
            confetti_pink=false;
			</script>
		</div>
		<div class="correctContainer">
			{#each correctWords as word}
				{#if word.gender==="M"}
					<WordCard background="lightblue">
						<div slot="frontContent">
							{word.FR}
						</div>

						<div slot="backContent">
							{word.EngWO}
						</div>
					</WordCard>
				{:else}
					<WordCard background="pink">
						<div slot="frontContent">
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

    .wordBox {
        background: violet;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .wordContainer {
        width: 30%;
        height: 10%;
        position: absolute;
        top:10%;
        left:36%
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
        opacity: 0.8;
        background: linear-gradient(142deg, pink 10%, blue 100%);
    }

</style>
