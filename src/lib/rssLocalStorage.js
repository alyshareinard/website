// place files you want to import through the `$lib` alias in this folder.

import { tick } from 'svelte';
export default function addToLocalStorage(key, item) {
    console.log('adding ', item);
	const feedInLocalStorage = JSON.parse(localStorage.getItem(key)) || [];
	localStorage.setItem(key, JSON.stringify([...feedInLocalStorage, item]));
}

export async function removeFromLocalStorage(key, item) {
		console.log('removing ', item);
	const feedInLocalStorage = JSON.parse(localStorage.getItem(key)) || [];
	const newfeed = [];
	for (let i = 0; i < feedInLocalStorage.length; i++) {
		let same = false;
		for (let subkey in feedInLocalStorage[i]) {
			if (feedInLocalStorage[i][subkey] != item[subkey]) {
				same = true;
			}
		}
		await tick();

		if (same) {
			newfeed.push(feedInLocalStorage[i]);
		}
	}
	
	localStorage.removeItem(key);
	localStorage.setItem(key, JSON.stringify(newfeed));
}

export async function updateLocalStorage(key, item, newitem){
    console.log("updating?", item, newitem)
    await removeFromLocalStorage(key, item)
    await tick();
    addToLocalStorage(key, newitem)
}
