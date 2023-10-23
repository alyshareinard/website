<script>
	import addToLocalStorage from '$lib/rssLocalStorage';

	$: feeds = JSON.parse(window.localStorage.getItem('feeds')) || [];
	$: poswords = JSON.parse(window.localStorage.getItem('poswords')) || [];
	$: negwords = JSON.parse(window.localStorage.getItem('negwords')) || [];
	$: importantPhrases = JSON.parse(window.localStorage.getItem('importantPhrases')) || [];
	let url;
	let ready = false;
	let title, posword, negword, importantPhrase;
	import { Accordion } from '$lib/components/Accordion';
	export let data;
	let { jobs } = data;
	import { removeFromLocalStorage } from '$lib/rssLocalStorage';
</script>

<nav>
	<h1>Better RSS Reader</h1>
	<h4>Do you want an RSS feed that prioritizes what you want to see?  Here you can add RSS feeds and then define words or phrases 
		you'd like to see, and those that you're not interested in.  The most relevant stories will rise to the top of the feed.
		I use this to sort posting for freelance work -- combining Upwork, Fiverr, and other sites into one list with the most relevant 
		postings at the top.   </h4>

	<div class="my-feeds">
		<h3>My feeds</h3>
		{#each feeds as feed}
			<div>
				<button
					class="deletebutton"
					on:click={() => {
						removeFromLocalStorage(feed.title, feed.url);
					}}>x</button
				>
				<a href={`/portfolio/RSSfeed/feed/${feed.title}?url=${feed.url}`}>{feed.title}</a>
			</div>
		{/each}
	</div>
</nav>

<div let:dataUpdate={feeds}>
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
	<div class="wordlists">
		<div class="wordlist">
			<h3>Words I'm looking for</h3>
			{#each poswords as word}
				<div>{word}</div>
			{/each}

			<input
				type="string"
				placeholder="enter desired word"
				bind:value={posword}
				on:input={() => {}}
			/>
			<button
				on:click={() => {
					addToLocalStorage('poswords', posword);
					location.reload();
				}}>Add</button
			>
		</div>
		<div class="wordlist">
			<h3>Words I'm not interested in</h3>
			{#each negwords as word}
				<div>{word}</div>
			{/each}

			<input
				type="string"
				placeholder="enter undesired word"
				bind:value={negword}
				on:input={() => {}}
			/>
			<button
				on:click={() => {
					addToLocalStorage('negwords', negword);
					location.reload();
				}}>Add</button
			>
		</div>
		<div class="wordlist">
			<h3>Pull to title phrases starting with</h3>
			{#each importantPhrases as phrase}
				<div>{phrase}</div>
			{/each}

			<input
				type="string"
				placeholder="important phrase"
				bind:value={importantPhrase}
				on:input={() => {}}
			/>
			<button
				on:click={() => {
					addToLocalStorage('importantPhrases', importantPhrase);
					location.reload();
				}}>Add</button
			>
		</div>
	</div>
</div>

{#if ready}
	{#await fetch(`/portfolio/RSSfeed/?url=${url}`).then((res) => res.json())}
		<p>Gathering information... Please wait</p>
	{:then data}
		{#if data.message === 'Internal Error'}
			<p>Something went wrong...Check your URL and try again</p>
		{:else}
			<div>
				<input bind:value={title} default={data.title} placeholder="Title" />
				<p>{data.description || ''}</p>
				{console.log('Here is the data', data) || ''}
			</div>
			<button
				on:click={() => {
					addToLocalStorage('feeds', { title: title || data.title, url: url });
					location.reload();
				}}>Add to My Feeds</button
			>
		{/if}
	{/await}
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
