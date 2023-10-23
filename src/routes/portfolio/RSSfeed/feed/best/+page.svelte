<script>
	import { Accordion } from '$lib/components/Accordion';
	import moment from 'moment';
	export let data;
	console.log('in best page.svelte ');
	import { onMount } from 'svelte';
	let response;
	let { jobs } = data;

	console.log('in svelte ', jobs);
</script>

{#if jobs}
	{#each jobs as job}
		<Accordion>
			<span slot="head">
                <h4>
				<a href={job.link} target="_blank"> {@html job.title} {job.score}</a>
            </h4>
			</span>

			<div slot="details">
				{@html job.description}
			</div>
		</Accordion>
	{/each}
{/if}

<style>
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
</style>
