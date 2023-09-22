<script>
    import { scale, fly } from 'svelte/transition';
	let hints = [
		'Usually nouns ending "-e" or "-ion" are feminine, nouns ending in anything else are masculine.',
		'Except that the endings "-age", "-ège" and "-isme" are usually masculine.', 
		'And, of course, there are other exceptions.',
	]
    console.log("in hints!")
    export let toggleHints

</script>

<div class="modal">
	<div class="modalEnvelope" transition:fly={{ y: 40 }}>
		<nav>
			<ul>
				<li><button on:click={toggleHints}> Close </button></li>
			</ul>
		</nav>	

            {#each hints as hint}
                <h4>{hint}</h4>
            {/each}




        <div on:click={toggleHints} transition:scale={{ start: 1.5, duration: 1000 }} class="background" />
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
        color:aliceblue
    }

	.modalEnvelope {
		position: fixed;
        left:5%;
        top:5%;
		text-align: center;
		background:grey;
		border-radius: 10px;
        width:30%;
        height:fit-content;
        
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
