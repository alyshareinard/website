<script lang="ts">
    import type { TransitionConfig } from 'svelte/transition';

    type Props = {
        cardHeight?: number;
        cardWidth?: number;
    };

    let { cardHeight = 200, cardWidth = 300 } = $props();
    let revealed = $state(false);

    function slide(node: HTMLElement, { delay = 0, duration = 400 } = {}): TransitionConfig {
        return {
            delay,
            duration,
            css: (t: number) => {
                const eased = t * (2 - t); // easeOut
                return `
                    transform: translate(-${100 - eased * 100}%, ${100 - eased * 100}%);
                    opacity: ${eased};
                `;
            }
        };
    }

    function handleMouseEnter(): void {
        revealed = true;
    }

    function handleMouseLeave(): void {
        revealed = false;
    }
</script>

<div
    class="card-container"
    style="height: {cardHeight}px; width: {cardWidth}px;"
    role="button"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onfocus={handleMouseEnter}
    onblur={handleMouseLeave}
>
    <div class="card-wrapper">
        <div class="card front" class:revealed>
            <div class="content">
                <slot />
            </div>
        </div>
        {#if revealed}
            <div class="card back" transition:slide>
                <div class="content">
                    <slot name="backContent" />
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .card-container {
        position: relative;
        perspective: 1000px;
        cursor: pointer;
        margin: 1rem;
    }

    .card-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .card {

        position: absolute;
		height: 100%;
		width: 100%;
		background-color: var(--mainTheme);
		border-color: #fff;
		border-style: solid;
		border-width: 5px;
		overflow: hidden;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;

        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.4s ease-out;
    }

    .card.front {
        background: #ffffff;
        transform-origin: top left;
    }

    .card.front.revealed {
        transform: translate(-5%, 5%) scale(0.95);
        opacity: 0.8;
    }

    .card.back {
        background: #f8f9fa;
        z-index: 2;
    }

    .content {
        padding: 1rem;
        text-align: center;
        width: 100%;
        height: 100%;
    }

    /* Add a subtle hover effect */
    .card-container:hover {
        transform: translateY(-2px);
        transition: transform 0.2s ease;
    }
</style>
