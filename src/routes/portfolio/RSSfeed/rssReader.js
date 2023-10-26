export async function testFeed(rawurl){
    let returnval
    console.log('starting testfeed')
    const url = 'https://corsproxy.io/?' + encodeURIComponent(rawurl);
    console.log("looking at url", url)
    await fetch(url)
    .then((res) => res.text())
    .then((text) => new window.DOMParser().parseFromString(text, 'text/xml'))
    .then((data) => {

        if (data.getElementsByTagName('rss').length==0){
            console.log('returning invalid')
            returnval = {format:'invalid'}
        } else {
            let rss = data.getElementsByTagName('rss')[0];
            console.log("rss", rss)
            if (rss.getElementsByTagName('channel').length!=0){
                console.log('returning rss')
                let channel = rss.getElementsByTagName('channel')
                //get title from channel
                let title = channel[0].getElementsByTagName('title')[0].textContent;
                let url = channel[0].getElementsByTagName('link')[0].textContent;
                returnval = {format:'rss', title:title, url:url}

            } else if (rss.getElementsByTagName('feed').length!=0){
                console.log('returning atom')
                let title = data.title
                let url =data.link
                returnval = {format:'atom', title:title, url:url}

            } else {
                console.log('returning unknown')
                returnval = {format:'unknown'}
            }
        }
    }).catch((err) => {
        console.log(err);
        console.log("error")
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
        let channel = data.getElementsByTagName('rss')[0].getElementsByTagName('feed');
        let items = Array.prototype.slice.call(channel[0].children);
        items.forEach((item) => {
            if (item.tagName === 'entry') {
                let description = getContent(item, 'content')
                let title = getContent(item, 'title')
                let score = getScore( description, title, pluswords, minuswords )
                if (score>0){
                jobs.push({
                    title: title,
                    subtitle: getImportantPhrases(description, importantPhrases),
                    description: description,
                    link: getContent(item, 'link'),
                    score: score,
                    date: getContent(item, 'published')
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
    console.log('starting readrss')
    let jobs = []
    await fetch(url)
    .then((res) => res.text())
    .then((text) => new window.DOMParser().parseFromString(text, 'text/xml'))
    .then((data) => {
        let channel = data.getElementsByTagName('rss')[0].getElementsByTagName('channel');
        let items = Array.prototype.slice.call(channel[0].children);
        items.forEach((item) => {
            console.log("item", item)
            if (item.tagName === 'item') {
                let description = getContent(item, 'description')
                let title = getContent(item, 'title')
                let score = getScore( description, title, pluswords, minuswords )
                if (score>0){
                jobs.push({
                    title: title,
                    subtitle: getImportantPhrases(description, importantPhrases),
                    description: description,
                    link: getContent(item, 'link'),
                    score: score,
                    date: getContent(item, 'pubDate')
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
            response = await readRss(url, pluswords, minuswords, importantPhrases)            
        } else if (feeds[i].format == 'atom'){
            response = await readAtom(url, pluswords, minuswords, importantPhrases)
        }
        console.log("response", response)
        if (response) {
            jobs = jobs.concat(response)
        }
    }
    console.log("jobs", jobs)
    jobs.sort((a,b)=>b.score-a.score);
    return jobs
}


function getContent(xmlObj, tagName) {
    return xmlObj.getElementsByTagName(tagName)[0].textContent;
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
function getScore(description, title, pluswords, minuswords) {
    let plus = 0
    let minus = 0

    
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