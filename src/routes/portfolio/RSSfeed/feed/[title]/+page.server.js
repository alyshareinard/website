//import Parser from "rss-parser";
export async function load({url}){
    let title = url.pathname.split("/").pop();
    const rssLink = url.searchParams.get('url');
    console.log("in feed page.server", rssLink)
    //const parser = new Parser();
   //let feed = await parser.parseURL(rssLink);
    //feed.title=title
    //console.log(feed.length);
    //return {...feed};
    return(title)
}