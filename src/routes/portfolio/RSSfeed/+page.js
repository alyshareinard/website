/** @type {import('./feed/best/$types').PageLoad} */
import { browser } from '$app/environment';
import rssReader from './rssReader.js';

export async function load() {
	let jobs;
	if (browser) {
		jobs = rssReader();
	}

	return {
		jobs: jobs,
		title: 'Better RSS feed',
		description:
			"Add 1 or more RSS feeds, define 'positive' and 'negative' words, items will be sorted based on the score (#positive - #negative)" +
			"Click to expand title to see description.  Define 'important phrases' which will be pulled out into a subtitle." +
			'See the most relevant stories first.'
	};
}
