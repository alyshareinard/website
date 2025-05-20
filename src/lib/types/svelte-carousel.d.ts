/**
 * Type declarations for svelte-carousel
 */
declare module 'svelte-carousel' {
  import { SvelteComponentTyped } from 'svelte';

  interface CarouselProps {
    /**
     * Array of elements to display in the carousel
     */
    elements?: any[];
    
    /**
     * Current active page
     */
    currentPageIndex?: number;
    
    /**
     * Number of pages to display
     */
    pagesCount?: number;
    
    /**
     * Infinite looping
     */
    infinite?: boolean;
    
    /**
     * Auto-play carousel
     */
    autoplay?: boolean;
    
    /**
     * Auto-play timeout duration in ms
     */
    autoplayDuration?: number;
    
    /**
     * Auto-play direction
     */
    autoplayDirection?: 'right' | 'left';
    
    /**
     * Dots navigation
     */
    dots?: boolean;
    
    /**
     * Arrow navigation
     */
    arrows?: boolean;
    
    /**
     * Swipe detection
     */
    swipe?: boolean;
    
    /**
     * Transition duration in ms
     */
    transitionDuration?: number;
  }

  export default class Carousel extends SvelteComponentTyped<CarouselProps> {}
}
