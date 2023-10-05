import { writable } from 'svelte/store';

export const correctWords = writable([])
const language = writable("en");
language.set("en")
language.subscribe((lan)=>console.log(lan))
language.update((language)=>(language==='fr' ? 'en' : 'fr', console.log(language)));