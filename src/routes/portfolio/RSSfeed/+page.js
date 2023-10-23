/** @type {import('./feed/best/$types').PageLoad} */
import { browser } from '$app/environment';



export async function load({ fetch }) {
	let jobs = []
	async function loadFeeds() {
		let jobs = [];
		const feeds = JSON.parse(window.localStorage.getItem('feeds')) || [];
        const pluswords = JSON.parse(window.localStorage.getItem('poswords')) || [];
        const minuswords = JSON.parse(window.localStorage.getItem('negwords')) || [];
		const importantPhrases = JSON.parse(window.localStorage.getItem('importantPhrases')) || [];
	
		for (let i = 0; i < feeds.length; i++) {
			const url = 'https://corsproxy.io/?' + encodeURIComponent(feeds[i].url);
	
			await fetch(url)
				.then((res) => res.text())
				.then((text) => new window.DOMParser().parseFromString(text, 'text/xml'))
				.then((data) => {
					let channel = data.getElementsByTagName('rss')[0].getElementsByTagName('channel');
					let items = Array.prototype.slice.call(channel[0].children);
					items.forEach((item) => {
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
								score: score
							});
						}
						}
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
		
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
	if (browser) {

		jobs = loadFeeds();
	}
		
		
		return { jobs: jobs,
			title: "Better RSS feed",
			description:
				"Add 1 or more RSS feeds, define 'positive' and 'negative' words, items will be sorted based on the score (#positive - #negative)"
				+"Click to expand title to see description.  Define 'important phrases' which will be pulled out into a subtitle." 
				+"See the most relevant stories first."
			}

}
