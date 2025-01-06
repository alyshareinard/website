<script>
	import { scale, fly } from 'svelte/transition';
	let how2play = ['Drag masculine nouns into the blue box and feminine nouns into the pink box.'];
	console.log('in how to play!');
	let { toggleHowtoPlay } = $props();
</script>

<div class="modal">
	<div class="modalEnvelope" transition:fly={{ y: 40 }}>
		<nav>
			<ul>
				<li><button onclick={toggleHowtoPlay}> Close </button></li>
			</ul>
		</nav>

		{#each how2play as how}
			<h4>{how}</h4>
		{/each}

		<div
			onclick={toggleHowtoPlay}
			transition:scale={{ start: 1.5, duration: 1000 }}
			class="background"
		></div>
	</div>
</div>

<style>
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

	h4 {
		color: aliceblue;
	}

	.modalEnvelope {
		position: fixed;
		left: 5%;
		top: 5%;
		text-align: center;
		background: grey;
		border-radius: 10px;
		width: 30%;
		height: fit-content;
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
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}
</style>
