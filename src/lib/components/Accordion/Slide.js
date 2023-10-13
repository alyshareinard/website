export function slide(node, isOpen) {
    // Initialize
    let initialHeight = node.offsetHeight;
    node.style.height = isOpen ? 'auto' : '0';
    node.style.overflow = "hidden";

    let animation = node.animate(
        [
        {
            height:0,
            padding:0,

        }, {
            height: `${initialHeight}px`,
        }],{
            duration:500,
            fill: 'both',
            direction: isOpen ? 'reverse' : 'normal'
        }

    )
    animation.pause()
    animation.onfinish = ({ currentTime }) => {
        if (!currentTime){
                animation.reverse();
                animation.pause();

    }
    node.dispatchEvent( new CustomEvent('animationEnd') );
    }

    // Open
    return {
        update: () => {
            animation.currentTime ? animation.reverse() : animation.play()
    
        }
    }

}