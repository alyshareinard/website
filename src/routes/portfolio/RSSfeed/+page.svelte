<script>

	import addToLocalStorage from '$lib/rssLocalStorage';
	console.log(addToLocalStorage);
    $: feeds = JSON.parse(window.localStorage.getItem("feeds")) || [];
	let url;
	let ready = false;
	let title;
	
    import { removeFromLocalStorage } from '$lib/rssLocalStorage';
</script>

<nav>

	<a href = "RSSfeed/feed/best">Best</a>
	<br>
	<span>My Feeds:</span>
	<div class="my-feeds">
		{#each feeds as feed}
			{@const number = feeds.indexOf(feed)}
			<div>
				{number + 1}. <a href={`/portfolio/RSSfeed/feed/${feed.title}?url=${feed.url}`}>{feed.title}</a> 
                <button on:click={()=>{removeFromLocalStorage(feed.title, feed.url)}}>x</button>
			</div>
		{/each}
	</div>
</nav>


<div let:dataUpdate={feeds}>
    <h1>RSS Reader</h1>
    <h3>Add a new feed:</h3>
    <input
        type="url"
        placeholder="Enter an RSS link..."
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
	</div>

{#if ready}
	{#await fetch(`/portfolio/RSSfeed/?url=${url}`).then((res) => res.json())}
		<p>Gathering information... Please wait</p>
	{:then data}
		{#if data.message === 'Internal Error'}
			<p>Something went wrong...Check your URL and try again</p>
		{:else}
			<div>

				<input bind:value={title} default={data.title} placeholder='Title' />
				<p>{data.description || ''}</p>
				{console.log("Here is the data", data) || ''}
			</div>
			<button on:click={()=>{
                addToLocalStorage(title||data.title, url);
                location.reload();
                }}>Add to My Feeds</button>
		{/if}
	{/await}
{/if}
<!-- <a href="/get/hello">hello</a> -->

<style>


    input{
        padding:15px;
        font-size: 20px;
        width: 50%;
    }

</style>