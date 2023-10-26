// place files you want to import through the `$lib` alias in this folder.

import { tick }  from 'svelte';
export default function addToLocalStorage(key, item) {
	let feedInLocalStorage = JSON.parse(localStorage.getItem(key)) || [];
	localStorage.setItem(key, JSON.stringify([...feedInLocalStorage, item]));
}

export async function removeFromLocalStorage(key, item) {
    
	console.log('removing ', item);
	let feedInLocalStorage = JSON.parse(localStorage.getItem(key)) || [];
	let newfeed = [];
	for (let i = 0; i < feedInLocalStorage.length; i++) {
		let same = false;
		for (let subkey in feedInLocalStorage[i]) {
			console.log(subkey);
			console.log(item[subkey]);
			console.log(feedInLocalStorage[i][subkey]);
			if (feedInLocalStorage[i][subkey] != item[subkey]) {
				console.log('not equal');
				same = true;
			}
		}
        await tick()

		if (same) {
            console.log(same)
			console.log('not the same, adding to newfeed');
			newfeed.push(feedInLocalStorage[i]);
		}
        console.log(same, !same)
        console.log(newfeed)
	}
	console.log('newfeed', newfeed);
		localStorage.removeItem(key);
		localStorage.setItem(key, JSON.stringify(newfeed));
}
