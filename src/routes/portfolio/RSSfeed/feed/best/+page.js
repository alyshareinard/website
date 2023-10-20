/** @type {import('./$types').PageLoad} */
import { browser } from '$app/environment';

export async function load( { fetch }) {
    console.log('in load')
    let myurl
    if (browser) {
        const feeds = JSON.parse(window.localStorage.getItem("feeds")) || [];
        let response
        console.log("browser is up")
        for (let i = 0; i < 1; i++) {
            const data = `my-url=${feeds[i].url}`;
            console.log("data is: ", data)

            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            
            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === this.DONE) {
                    console.log(this.responseText);
                }
            });
            
            xhr.open('POST', 'https://cors-proxy3.p.rapidapi.com/api');
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('X-RapidAPI-Key', '8d5b07f973mshc05a5ef098f7c14p163a68jsn12baa3a630c4');
            xhr.setRequestHeader('X-RapidAPI-Host', 'cors-proxy3.p.rapidapi.com');
            
            xhr.send(data);


        }
	return { feed: response };

}
}