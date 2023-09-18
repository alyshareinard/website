<script>
	export let open = false;
	let opener = "+";
	if (open) {
		opener = "-"
	}
    
	import { slide } from 'svelte/transition';
	function handleClick(){
        open = !open
        if (open) {
            opener = "-"
        } else {
            opener = "+"
        }
    };
</script>

<div class="accordion">
	<div class="header">
        <button on:click={handleClick}> {opener} </button>

		<div class="text">
			<slot name="head" />
		</div>

		
	</div>

	{#if open}
		<div class="details" transition:slide>
			<slot name="details" />
		</div>
	{/if}
</div>

<style>
	div.accordion {
		margin: 1rem 0;
	}

	div.header {
		display: flex;
		width: 100%;
	}

	div.header .text {
		flex: 1;
		margin-right: 5px;
        padding-left:5px;
	}

	div.details {
		background-color: var(--accentLight);
		padding: 1rem;
        border-radius:10px;
        color: var(--mainThemeDark);
	}
    button{
        background: transparent;
        border: none;
        color: var(--accent);
        font-size: 1.5rem;
        padding: 0px 5px;
    }
</style>
