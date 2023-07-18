<script>
    import GameModal from './gameModal.svelte';

    let isGameOpen=false;

    function toggleGame() {
        isGameOpen = !isGameOpen;
    }
</script>

<button> how to play </button>


<button on:click={toggleGame}> start game </button>


{#if isGameOpen}
    <GameModal { toggleGame } >
        some content?
        </GameModal>
{/if}

<style>
    button {
        background: darkcyan;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        margin: 10px;
    }
    </style>