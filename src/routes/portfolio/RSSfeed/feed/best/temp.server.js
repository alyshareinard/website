
import { onMount } from "svelte";

export async function load() {
    let myurl

    
    onMount(() => {
        console.log("mounted")
        const feeds = JSON.parse(window.localStorage.getItem("feeds")) || [];
        for (let i = 0; i < feeds.length; i++) {

            console.log(feeds[i])
            myurl=feeds[i].url
            console.log('refreshing feed', myurl);
            fetch(myurl, {mode:"no-cors"})
            .then(response => console.log(response))
            
        }
        
    })

}