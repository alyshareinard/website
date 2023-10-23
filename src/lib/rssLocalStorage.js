// place files you want to import through the `$lib` alias in this folder.
export default function addToLocalStorage (key, item ){
    let feedInLocalStorage = JSON.parse(localStorage.getItem(key)) || [];
    localStorage.setItem(key, JSON.stringify([...feedInLocalStorage, item]));
}

export function removeFromLocalStorage (key, item){
    console.log("removing ", item)
    let feedInLocalStorage = JSON.parse(localStorage.getItem(key)) || [];
    let newfeed=[]
    for (let i=0; i<feedInLocalStorage.length; i++){
        if (feedInLocalStorage[i] != item){
            newfeed.push(feedInLocalStorage[i])
        }
    }
    console.log(newfeed)
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(newfeed));
}