// place files you want to import through the `$lib` alias in this folder.
export default function addToLocalStorage (title, url){
    let feedInLocalStorage = JSON.parse(localStorage.getItem("feeds")) || [];
    localStorage.setItem("feeds", JSON.stringify([...feedInLocalStorage, {title:title, url:url}]));
}

export function removeFromLocalStorage (title, url){
    console.log("removing ", url)
    let feedInLocalStorage = JSON.parse(localStorage.getItem("feeds")) || [];
    let newfeed=[]
    for (let i=0; i<feedInLocalStorage.length; i++){
        if (feedInLocalStorage[i].url != url){
            newfeed.push(feedInLocalStorage[i])
        }
    }
    console.log(newfeed)
    localStorage.removeItem("feeds");
    localStorage.setItem("feeds", JSON.stringify(newfeed));
}