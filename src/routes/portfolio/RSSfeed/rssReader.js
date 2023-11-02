

export async function testFeed(rawurl){
    let returnval

    const url = 'https://corsproxy.io/?' + encodeURIComponent(rawurl);

    await fetch(url)
    .then((res) => res.text())
    .then((text) => new window.DOMParser().parseFromString(text, 'text/xml'))
    .then((data) => {

        if (data.getElementsByTagName('rss').length==0 && data.getElementsByTagName('feed').length==0){
//            console.log('returning invalid')
            returnval = {format:'invalid'}
        } else if (data.getElementsByTagName('rss').length!=0){
            let rss = data.getElementsByTagName('rss')[0];
//            console.log("rss", rss)
            if (rss.getElementsByTagName('channel').length!=0){
//                console.log('returning rss')
                let channel = rss.getElementsByTagName('channel')
                //get title from channel
                let title = channel[0].getElementsByTagName('title')[0].textContent;
                let url = channel[0].getElementsByTagName('link')[0].textContent;
                returnval = {format:'rss', title:title, url:url}
            }
        } else if (data.getElementsByTagName('feed').length!=0){
            let feed=data.getElementsByTagName('feed')[0];


            if (feed.getElementsByTagName('title').length!=0){
//                console.log('returning atom')
 
                let title = feed.getElementsByTagName('title')[0].textContent;
                let url =feed.getElementsByTagName('link')[0].textContent;
                returnval = {format:'atom', title:title, url:url}

            } else {
//                console.log('returning unknown')
                returnval = {format:'unknown'}
            }
        }
    }).catch((err) => {
//        console.log(err);
//        console.log("error")
        returnval = {format:'invalid', error:err}

    })  
    return(returnval)
}

async function readAtom(url, pluswords, minuswords, importantPhrases){
    let jobs = []
    await fetch(url)
    .then((res) => res.text())
    .then((text) => new window.DOMParser().parseFromString(text, 'text/xml'))
    .then((data) => {
        let feed = data.getElementsByTagName('feed');
        let items = Array.prototype.slice.call(feed[0].children);
        items.forEach((item) => {
            if (item.tagName === 'entry') {
                let description = getContent(item, 'content')
                let title = getContent(item, 'title')
                let pubDate = getContent(item, 'published')
                let score = getScore( description, title, pubDate, pluswords, minuswords )
                if (score>=0){
                    
                jobs.push({
                    title: title,
                    subtitle: getImportantPhrases(description, importantPhrases),
                    description: description,
                    link: getContent(item, 'uri'),
                    score: score,
                    date: pubDate
                });
            }
            }
        });
    })
    .catch((err) => {
        console.log(err);
        return null;
    });
    return(jobs)
}

async function readRss(url, pluswords, minuswords, importantPhrases){
//    console.log('starting readrss')
    let jobs = []
    await fetch(url)
    .then((res) => res.text())
    .then((text) => new window.DOMParser().parseFromString(text, 'text/xml'))
    .then((data) => {
        let channel = data.getElementsByTagName('rss')[0].getElementsByTagName('channel');
        let items = Array.prototype.slice.call(channel[0].children);
        items.forEach((item) => {
            //console.log("item", item)
            if (item.tagName === 'item') {
                let description = getContent(item, 'description')
                let title = getContent(item, 'title')
                let pubDate = getContent(item, 'pubDate')
                let score = getScore( description, title, pubDate, pluswords, minuswords )
                if (score>0){
                jobs.push({
                    title: title,
                    subtitle: getImportantPhrases(description, importantPhrases),
                    description: description,
                    link: getContent(item, 'link'),
                    score: score,
                    date: pubDate
                });
            }
            }
        });
    })
    .catch((err) => {
        console.log(err);
        return null;
    });
    return(jobs)
}

export default async function rssReader() {
    let jobs = [];
    const feeds = JSON.parse(window.localStorage.getItem('feeds')) || [];
    const pluswords = JSON.parse(window.localStorage.getItem('poswords')) || [];
    const minuswords = JSON.parse(window.localStorage.getItem('negwords')) || [];
    const importantPhrases = JSON.parse(window.localStorage.getItem('importantPhrases')) || [];

    for (let i = 0; i < feeds.length; i++) {
        let response
        const url = 'https://corsproxy.io/?' + encodeURIComponent(feeds[i].url);
        if (feeds[i].format == 'rss'){
            console.log('reading rss')
            response = await readRss(url, pluswords, minuswords, importantPhrases)            
        } else if (feeds[i].format == 'atom'){
            console.log('reading atom')
            response = await readAtom(url, pluswords, minuswords, importantPhrases)
        }
        //console.log("response", response)
        if (response) {
            jobs = jobs.concat(response)
        }
    }
    //console.log("jobs", jobs)
    jobs.sort((a,b)=>b.score-a.score);
    return jobs
}


function getContent(xmlObj, tagName) {
    if (!('getElementsByTagName' in xmlObj)) {
        console.log('element not found', tagName)

        return null
    }
    console.log(xmlObj.getElementsByTagName(tagName))
    if ('textContent' in xmlObj.getElementsByTagName(tagName)) {
        return xmlObj.getElementsByTagName(tagName)[0].textContent;
    } else {
        return xmlObj.getElementsByTagName(tagName)[0];
    }
}

function getImportantPhrases(description, importantPhrases) {
    let subtitle='';

    for (let i=0; i<importantPhrases.length; i++) {
        let index = description.indexOf(importantPhrases[i])

        if (index != -1) {
            let indexlast = description.indexOf('<br />', index)
            subtitle += '<br />' + description.substring(index, indexlast)
        }

    }
    return subtitle
}
function getScore(description, title, date, pluswords, minuswords) {
    //console.log(title)
    let minus = 0
    let pubDate = new Date(date)
    let today = new Date()
    let diff = today.getTime() - pubDate.getTime();
    //console.log("diff", diff)
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    //console.log("days", days)
    let plus = 5-days;
    //console.log("plus", plus)
    for (let i=0; i<pluswords.length; i++) {

        var regExp = new RegExp(pluswords[i], "gi");
        
        let newval = (description.match(regExp) || []).length
        let titleVal = (title.match(regExp) || []).length
        plus += newval
        plus += 2*titleVal

    }

    for (let i=0; i<minuswords.length; i++) {

        var regExpminus = new RegExp(minuswords[i], "gi");
        let newval = (description.match(regExpminus) || []).length
        let titleVal = (title.match(regExp) || []).length
        minus += newval
        minus += 2*titleVal

    }

    return plus-minus

}