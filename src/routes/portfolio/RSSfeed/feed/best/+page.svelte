<script>

	import moment from 'moment';
	export let data; 
    console.log("in best page.svelte ")
    import { onMount } from 'svelte';
    let response
    data.myurl="https://app.sveltejobs.com/feed/posts"

    const { feed } = data
    
//    onMount(() => {
//        refreshRSS()
//    })
        
    async function refreshRSS(){
        const feeds = JSON.parse(window.localStorage.getItem("feeds")) || [];
            
        for (let i = 0; i < 1; i++) {
            console.log("fetching ",feeds[i].url)
            data.myurl=feeds[i].url

//            fetch(feeds[i].url, {mode:"no-cors"})
 //           .then(response => console.log(response))
//            .then(response => response.text())
//            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
//            .then(data => console.log(data))
            console.log("done")
//            const response = await fetch(feeds[i].url, {method:"GET",mode:"no-cors"} );
//            console.log(response)
//            myfeed=htmlparser2.parseFeed(response);
//            console.log(feeds[i], myfeed.length)

        }  
    }

    console.log("fetched ",feed)



</script>

<h1>
	{data.title}
</h1>
{#if feed}
<p>
    data.feed {feed}
</p>
{:else}
<p>Nothing yet

</p>
{/if}
{#if data.items}
	{#each data.items as item}
		{@const number = data.items.indexOf(item)}
		<div class="item">
			{number + 1}.
			<a href={item.link} target="_blank"> {@html item.title}</a>
			<div class="metadata">
				<span>{item.author || item.creator || ''}</span>
				<span>{moment(item.isoDate).fromNow()}</span>
			</div>
			<div class="snippet">{item.contentSnippet || ''}</div>
		</div>
	{/each}
{:else}
	<p>Something went wrong...</p>
{/if}

<style>
	.snippet {
		font-size: 18px;
	}
	a {
		font-size: 25px;
		text-decoration: underline;
		color: var(--accent);

		&:visited {
			color: gray;
		}

		&:hover {
			text-decoration: none;
		}
	}

	.item {
		display: flex;
		flex-direction: column;
		padding: 10px 10px;
	}

	.metadata {
		display: flex;
		gap: 10px;
		margin: 10px 0px 10px 0px;
	}
</style>
