<script>
	import { quadInOut } from 'svelte/easing';
	import { slide } from './Slide'
	export let isOpen = false;
	export let startOpen=false;
	if (startOpen){
		isOpen = true;

	}

	function toggleDescription(){
		isOpen ? (isOpen = false) : (isOpen = true);
	}
	function openDescription(){

		isOpen = true;


	}
	function closeDescription(){
		setTimeout(() => {
			isOpen = false;

		}, 200)

	}
	
</script>
<div class=container>
<div on:mouseenter={openDescription} on:mouseleave={closeDescription} class="accordion" role="button" tabindex="0">

	<div class="header">

        <button aria-label="toggle description" on:click={toggleDescription}> <span class={isOpen ? "chevron right" : "chevron down"}/> </button>

		<div class="text">
			<slot name="head" />
		</div>


	</div>


		<div class="details" use:slide={isOpen} >
			<slot name="details" />
		</div>

</div>
</div>

<style>
	div.accordion {
		width: 100%;
	}


	div.header {
		display: flex;
		width: 100%;
	}

	div.header .text {
		flex: 1;
		margin-right: 5px;
        padding-left:10px;
		
	}

	div.details {
		background-color: var(--accentLight);
		padding: 1px 20px;
		margin:0 20px;
        border-radius:10px;
        color: var(--mainThemeDark);
	}
	.container {
		padding:10px;
	}
    button{
        background: transparent;
        border: none;
        color: var(--accent);
        font-size: 1.5rem;
        padding: 12px 3px 5px 5px;
    }

	.chevron {
		--height:10px;
		--thickness:calc(var(--height) / 4);
		border-style: solid;
		border-width: var(--thickness) var(--thickness) 0 0;
		content: '';
		display: inline-block;
		height: var(--height);
		left:  calc(var(--height) / 3);
		position: relative;
		top: calc(var(--height) / 3);
		vertical-align: top;
		width: var(--height);
		
	}

	.chevron.down{
		left: 0;
		transform: rotate(45deg);
	}

	.chevron.right {
		top: 0;
		transform: rotate(135deg);
	}


	

</style>
