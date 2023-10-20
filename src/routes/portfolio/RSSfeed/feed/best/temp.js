//import Parser from 'rss-parser';
//let parser = new Parser();
export async function refreshFeed(myurl) {
	console.log('refreshing feed', myurl);
    fetch(myurl, {mode:"no-cors"})
    .then(response => console.log(response))



//	console.log('made parser');

/*	let feed = await parser.parseURL(url);
	if (feed) {
		console.log(feed.length);
	} else {
		console.log('Invalid feed');
	}
	return { ...feed };*/
}
