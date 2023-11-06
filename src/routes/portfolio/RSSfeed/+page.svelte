<script>
	import addToLocalStorage, { removeFromLocalStorage, updateLocalStorage } from '$lib/rssLocalStorage';
	import rssReader, { testFeed } from './rssReader';
	import { invalidateAll } from '$app/navigation';
	import { Accordion } from '$lib/components/Accordion';
	import { tick } from 'svelte';

	$: feeds = JSON.parse(window.localStorage.getItem('feeds')) || [];
	$: poswords = JSON.parse(window.localStorage.getItem('poswords')) || [];
	$: negwords = JSON.parse(window.localStorage.getItem('negwords')) || [];
	$: importantPhrases = JSON.parse(window.localStorage.getItem('importantPhrases')) || [];
	let url, ready;
	let feedmessage = '';
	let showFeedButton = false;
	let title, posword, negword, importantPhrase;
	
	export let data;
	let { jobs } = data;
	
	let response;
	let showOptions = true;

	async function test_feed() {
		response = await testFeed(url);
		await tick();

		if (response.format == 'invalid') {
			feedmessage = 'This does not seem to be an RSS feed...Check your URL and try again';
			showFeedButton = false;
		} else if (response.format == 'unknown') {
			feedmessage = 'Format unknown -- this app can only parse atom or rss feeds';
			showFeedButton = false;
		} else if (response.format == 'rss' || response.format == 'atom') {
			feedmessage = 'Feed is valid -- click to add';
			showFeedButton = true;
		}
	}

	function toggleActive(feed) {
		let myfeed = {...feed}
		myfeed.active = !myfeed.active
		updateLocalStorage('feeds', feed, myfeed);
	}
	function addItem(name, value) {
		addToLocalStorage(name, value);
		if (name == 'feeds') {
			feeds.push(value);
			feeds = [...feeds];
		} else if (name == 'poswords') {
			poswords.push(value);
			poswords = [...poswords];
		} else if (name == 'negwords') {
			negwords.push(value);
			negwords = [...negwords];
		} else if (name == 'importantPhrases') {
			importantPhrases.push(value);
			importantPhrases = [...importantPhrases];
		}
	}
	function removeItem(name, value) {
		removeFromLocalStorage(name, value);
		if (name == 'feeds') {
			feeds.splice(feeds.indexOf(value), 1);
			feeds = [...feeds];
		} else if (name == 'poswords') {
			poswords.splice(poswords.indexOf(value), 1);
			poswords = [...poswords];
		} else if (name == 'negwords') {
			negwords.splice(negwords.indexOf(value), 1);
			negwords = [...negwords];
		} else if (name == 'importantPhrases') {
			importantPhrases.splice(importantPhrases.indexOf(value), 1);
			importantPhrases = [...importantPhrases];
		}
	}

</script>

<h1>Better RSS Reader</h1>

<h4>
	Do you want an RSS feed that prioritizes what you want to see? Here you can add RSS feeds and then
	define words or phrases you'd like to see, and those that you're not interested in. The most
	relevant stories will rise to the top of the feed. I use this to sort posting for freelance work
	-- combining Upwork, Fiverr, and other sites into one list with the most relevant postings at the
	top.
</h4>
<button on:click={() => (showOptions = !showOptions)}>toggle options</button>
<button
	on:click={() => {
		invalidateAll();
	}}>refresh feeds</button
>
{#if showOptions}
	<div class="options">
		<div class="my-feeds">
			<h3>My feeds</h3>
			{#each feeds as feed}
				<div>
					<input type="checkbox" checked={feed.active} on:click|preventDefault={toggleActive(feed)}/>
					<button
						class="deletebutton"
						on:click={() => {
							removeItem('feeds', feed);
						}}>x</button
					>
					<a href={`/portfolio/RSSfeed/feed/${feed.title}?url=${feed.url}`}>{feed.title}</a>
				</div>
			{/each}
		</div>

		<div>
			<input
				type="url"
				placeholder="Add an RSS link..."
				bind:value={url}
				on:input={() => {
					if (url.length > 0) {
						setTimeout(() => {
							ready = true;
						}, 250);
					} else {
						ready = false;
					}
				}}
			/>
			<p>{feedmessage}</p>
			{#if ready}
				{#await test_feed()}
					<p>Gathering information... Please wait</p>
				{/await}
			{/if}
			{#if showFeedButton}
				<div>
					<input bind:value={title} default={response.title} placeholder="Title" />
				</div>
				<button
					on:click={() => {
						addItem('feeds', {
							title: title || response.title,
							url: url,
							active: true,
							format: response.format
						});
					}}>Add to My Feeds</button
				>
			{/if}
		</div>

		<div class="wordlists">
			<div id="poswords" class="wordlist">
				<h3>Words I'm looking for</h3>
				{#each poswords as word}
					<div>
						<button
							class="deletebutton"
							on:click={() => {
								removeItem('poswords', word);
							}}>x</button
						>{word}
					</div>
				{/each}

				<input
					type="string"
					placeholder="enter desired word"
					bind:value={posword}
					on:input={() => {}}
				/>
				<button
					on:click={() => {
						addItem('poswords', posword);
					}}>Add</button
				>
			</div>
			<div class="wordlist">
				<h3>Words I'm not interested in</h3>
				{#each negwords as word}
					<div>
						<button
							class="deletebutton"
							on:click={() => {
								removeItem('negwords', word);
							}}>x</button
						>{word}
					</div>
				{/each}

				<input
					type="string"
					placeholder="enter undesired word"
					bind:value={negword}
					on:input={() => {}}
				/>
				<button
					on:click={() => {
						addItem('negwords', negword);
					}}>Add</button
				>
			</div>
			<div class="wordlist">
				<h3>Pull to subtitle phrases starting with... (experimental)</h3>
				{#each importantPhrases as phrase}
					<div>
						<button
							class="deletebutton"
							on:click={() => {
								removeItem('importantPhrases', phrase);
							}}>x</button
						>{phrase}
					</div>
				{/each}

				<input
					type="string"
					placeholder="important phrase"
					bind:value={importantPhrase}
					on:input={() => {}}
				/>
				<button
					on:click={() => {
						addItem('importantPhrases', importantPhrase);
					}}>Add</button
				>
			</div>
		</div>
	</div>
{/if}
{#if jobs}
	{#each jobs as job}
		<Accordion lethover="false">
			<span slot="head">
				Score: {job.score} <a href={job.link} target="_blank"> {job.title}</a>
			</span>

			<div slot="subtitle">{@html job.subtitle}</div>

			<div slot="details">
				{@html job.description}
			</div>
		</Accordion>
	{/each}
{/if}

<style>
	a {
		text-decoration: underline;
		color: var(--accent);

		&:visited {
			color: gray;
		}

		&:hover {
			text-decoration: none;
		}
	}

	.deletebutton {
		color: white;
		width: fit-content;
		height: fit-content;
		padding: 1px;
		margin: 2px;
		background-color: black;
	}
	nav {
		margin-top: 20px;
	}
	input {
		padding: 15px;
		font-size: 20px;
		width: 50%;
	}
	.wordlists {
		display: flex;
		flex: auto;
		flex-direction: row;
	}
	.wordlist {
		width: 30%;
	}
</style>
