<script lang="ts">
	import { track } from '$lib/analytics';
	import { highlight, rank } from '$lib/rank/score';
	import {
		DEFAULT_DETAILS,
		DEFAULT_MINUS,
		DEFAULT_PLUS,
		SAMPLE_POSTS
	} from '$lib/rank/samplePosts';

	type Kind = 'plus' | 'minus' | 'details';

	const MIN_SCORE = 2;
	const kinds: Kind[] = ['plus', 'minus', 'details'];

	let lists = $state<Record<Kind, string[]>>({
		plus: [...DEFAULT_PLUS],
		minus: [...DEFAULT_MINUS],
		details: [...DEFAULT_DETAILS]
	});
	let inputs = $state<Record<Kind, string>>({ plus: '', minus: '', details: '' });
	let sortBy = $state<'best' | 'newest'>('best');
	let hideLow = $state(false);
	let notice = $state('');
	let touched = $state(false);

	const ranked = $derived(rank(SAMPLE_POSTS, lists.plus, lists.minus, lists.details));
	const shown = $derived.by(() => {
		const rows = ranked.map((item, position) => ({ ...item, position }));
		const visible = hideLow ? rows.filter((item) => item.score >= MIN_SCORE) : rows;
		return sortBy === 'best' ? visible : [...visible].sort((a, b) => a.arrivalIndex - b.arrivalIndex);
	});
	const hiddenCount = $derived(ranked.length - shown.length);

	const config: Record<Kind, { title: string; hint: string; placeholder: string }> = {
		plus: {
			title: 'Words I want to see',
			hint: 'Each mention adds a point (two in the title).',
			placeholder: 'e.g. hubspot'
		},
		minus: {
			title: "Words I'm not interested in",
			hint: 'Each mention takes a point away.',
			placeholder: 'e.g. shopify'
		},
		details: {
			title: 'Details to pull out',
			hint: 'Shows the line that starts with this label.',
			placeholder: 'e.g. Budget'
		}
	};

	const steps = $derived.by(() => {
		const out: string[] = [];
		if (lists.plus.length) {
			out.push(`Rank higher when items mention: ${lists.plus.join(', ')} (double weight in the title)`);
		}
		if (lists.minus.length) out.push(`Rank lower when items mention: ${lists.minus.join(', ')}`);
		if (lists.details.length) out.push(`Pull out these details: ${lists.details.join(', ')}`);
		if (hideLow) out.push('Hide items that score too low');
		return out;
	});

	const contactHref = $derived.by(() => {
		const list = steps.length ? steps.map((step) => `- ${step}`).join('\n') : '- (no rules yet)';
		const message =
			`I tried your feed ranker and I'd like help setting up something like it for my own sources:\n\n${list}\n\n` +
			'Where the items come from: \nWhere the best ones should go (email, Slack, a spreadsheet...): \nHow often: ';
		return `/contact?service=Integration&message=${encodeURIComponent(message)}#contactForm`;
	});

	function add(kind: Kind) {
		const word = inputs[kind].trim();
		if (!word) return;
		notice = '';
		const lower = word.toLowerCase();
		if (lists[kind].some((existing) => existing.toLowerCase() === lower)) {
			notice = `"${word}" is already in that list.`;
			return;
		}
		const other = kind === 'plus' ? 'minus' : kind === 'minus' ? 'plus' : null;
		if (other && lists[other].some((existing) => existing.toLowerCase() === lower)) {
			notice = `"${word}" is already in the ${other === 'plus' ? '"want to see"' : '"not interested"'} list. A word can only be in one.`;
			return;
		}
		lists[kind] = [...lists[kind], word];
		inputs[kind] = '';
		if (!touched) track('ranker_edit');
		touched = true;
	}

	function remove(kind: Kind, word: string) {
		lists[kind] = lists[kind].filter((existing) => existing !== word);
		notice = '';
		if (!touched) track('ranker_edit');
		touched = true;
	}

	function reset() {
		lists = { plus: [...DEFAULT_PLUS], minus: [...DEFAULT_MINUS], details: [...DEFAULT_DETAILS] };
		inputs = { plus: '', minus: '', details: '' };
		hideLow = false;
		sortBy = 'best';
		notice = '';
	}

	function age(days: number): string {
		if (days === 0) return 'today';
		return days === 1 ? '1 day ago' : `${days} days ago`;
	}

	function moved(item: { position: number; arrivalIndex: number }): string {
		const change = item.arrivalIndex - item.position;
		if (change > 0) return `▲ ${change}`;
		if (change < 0) return `▼ ${-change}`;
		return '–';
	}
</script>

{#snippet marked(text: string)}
	{#each highlight(text, lists.plus, lists.minus) as segment}
		{#if segment.kind}<mark class={segment.kind}>{segment.text}</mark>{:else}{segment.text}{/if}
	{/each}
{/snippet}

<div class="ranker">
	<header class="page-head">
		<span class="eyebrow">Free demo</span>
		<h1>Feed ranker</h1>
		<p class="lead">
			Job posts, leads, news, tickets: the good stuff gets buried. Tell this tool which words matter
			and watch a list of posts re-sort itself so the best ones come first.
		</p>
		<p class="no-ai">
			The scoring is plain, rule-based code, not AI, so the same words always give the same order.
			The posts below are made up.
		</p>
		<ul class="chips trust">
			<li class="chip">Runs in your browser</li>
			<li class="chip">Code, not AI</li>
			<li class="chip">Free</li>
		</ul>
	</header>

	<div class="layout">
		<aside class="controls card" aria-label="Your rules">
			<div class="controls-head">
				<h2>Your rules</h2>
				<button class="linklike" onclick={reset}>Reset</button>
			</div>

			{#each kinds as kind}
				<div class="wordlist {kind}">
					<h3>{config[kind].title}</h3>
					<p class="hint">{config[kind].hint}</p>
					<ul class="tags">
						{#each lists[kind] as word (word)}
							<li>
								<span class="tag {kind}">
									{word}
									<button
										class="x"
										onclick={() => remove(kind, word)}
										aria-label="Remove {word}">×</button
									>
								</span>
							</li>
						{/each}
					</ul>
					<form
						class="add"
						onsubmit={(event) => {
							event.preventDefault();
							add(kind);
						}}
					>
						<input
							type="text"
							bind:value={inputs[kind]}
							placeholder={config[kind].placeholder}
							aria-label="Add to: {config[kind].title}"
						/>
						<button class="btn-secondary small" type="submit">Add</button>
					</form>
				</div>
			{/each}

			<p class="notice" role="status">{notice}</p>

			<details class="how">
				<summary>How the score works</summary>
				<p>
					Every post starts with up to 5 points for being new (5 today, one fewer for each day, never
					below 0). Then each mention of a word you want adds 1 point, or 2 if it's in the title.
					Each mention of a word you don't want takes points away the same way. Highest score wins;
					ties go to the newer post.
				</p>
			</details>
		</aside>

		<section class="results" aria-labelledby="results-heading">
			<div class="results-head">
				<h2 id="results-heading">{sortBy === 'best' ? 'Ranked for you' : 'As they arrived'}</h2>
				<div class="toggles">
					<label>
						<input type="radio" name="sort" value="best" bind:group={sortBy} /> Best match first
					</label>
					<label>
						<input type="radio" name="sort" value="newest" bind:group={sortBy} /> Newest first
					</label>
					<label>
						<input type="checkbox" bind:checked={hideLow} /> Hide low matches
					</label>
				</div>
			</div>
			<p class="meta" aria-live="polite">
				{shown.length} of {ranked.length} posts{hiddenCount
					? ` (${hiddenCount} hidden: score under ${MIN_SCORE})`
					: ''}.
				{#if sortBy === 'best'}Arrows show how far each post moved from the order it arrived in.{/if}
			</p>

			<ol class="posts">
				{#each shown as item (item.post.id)}
					<li class="card post" class:low={item.score < MIN_SCORE}>
						<div class="post-top">
							<h3>{@render marked(item.post.title)}</h3>
							<div class="badges">
								<span class="score" title="Score">{item.score}</span>
								{#if sortBy === 'best'}
									<span
										class="moved"
										class:up={item.arrivalIndex > item.position}
										class:down={item.arrivalIndex < item.position}
										title="Compared with the order posts arrived in">{moved(item)}</span
									>
								{/if}
							</div>
						</div>
						<p class="source">{item.post.source} · {age(item.post.daysAgo)}</p>

						{#if item.details.length}
							<ul class="details">
								{#each item.details as line}
									<li>{@render marked(line)}</li>
								{/each}
							</ul>
						{/if}

						{#if item.plusHits.length || item.minusHits.length}
							<ul class="chips why" aria-label="Why it scored this way">
								{#each item.plusHits as hit}
									<li class="chip plus">+ {hit.word} ×{hit.count}</li>
								{/each}
								{#each item.minusHits as hit}
									<li class="chip minus">− {hit.word} ×{hit.count}</li>
								{/each}
							</ul>
						{/if}

						<details class="desc">
							<summary>Show full post</summary>
							<p>{@render marked(item.post.description)}</p>
						</details>
					</li>
				{:else}
					<li class="empty">Nothing left to show. Try removing a word or unticking "Hide low matches".</li>
				{/each}
			</ol>
		</section>
	</div>

	<section class="card cta" aria-labelledby="cta-heading">
		<h2 id="cta-heading">Want this watching your real sources?</h2>
		<p>
			This demo ranks a fixed set of made-up posts. A custom version reads your real sources (job
			boards, RSS feeds, email alerts, form submissions, a spreadsheet), scores everything with your
			own rules, and sends only the best matches to where you'll see them: an email, a Slack
			channel, a Google Sheet. No checking, no scrolling.
		</p>

		<div class="recipe">
			<h3>Your rules so far</h3>
			{#if steps.length}
				<ol>
					{#each steps as step}<li>{step}</li>{/each}
				</ol>
				<p class="hint">
					If you write to me from here, only these rules go into the message, nothing else.
				</p>
			{:else}
				<p class="hint">Add a few words above and your rules will show up here in plain English.</p>
			{/if}
		</div>

		<a class="btn-primary" href={contactHref} onclick={() => track('ranker_cta')}
			>Ask about setting this up</a
		>
	</section>
</div>

<style>
	.page-head {
		text-align: center;
		margin: 2rem auto 2.5rem;
		max-width: 40rem;
	}

	.page-head h1 {
		margin: 0.3rem 0 0.75rem;
	}

	.lead {
		color: var(--text-muted);
		font-size: 1.15rem;
		margin: 0 0 1rem;
	}

	.no-ai {
		font-size: 1rem;
		margin: 0 0 1rem;
		color: var(--text-muted);
	}

	.trust {
		justify-content: center;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1.25rem;
		align-items: start;
	}

	.controls h2,
	.results-head h2 {
		text-align: left;
		font-size: 1.3rem;
		margin: 0;
	}

	.controls-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.5rem;
	}

	.linklike {
		background: none;
		border: none;
		margin: 0;
		padding: 0;
		color: var(--mainThemeLighter);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.linklike:hover {
		background: none;
		color: var(--accent);
	}

	.wordlist {
		margin: 1.25rem 0;
	}

	.wordlist h3 {
		margin: 0;
		font-size: 1rem;
	}

	.hint {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin: 0.15rem 0 0.5rem;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		list-style: none;
		margin: 0 0 0.6rem;
		padding: 0;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.15rem;
		padding: 0.15rem 0.3rem 0.15rem 0.65rem;
		border-radius: 999px;
		font-size: 0.88rem;
		border: 1px solid var(--border);
	}

	.tag.plus {
		background: rgba(80, 230, 230, 0.1);
		border-color: rgba(80, 230, 230, 0.35);
		color: var(--mainThemeLighter);
	}

	.tag.minus {
		background: rgba(255, 165, 90, 0.1);
		border-color: rgba(255, 165, 90, 0.4);
		color: var(--accent);
	}

	.tag.details {
		background: var(--surface-2);
		color: var(--text);
	}

	.x {
		margin: 0;
		padding: 0 0.4rem;
		background: none;
		border: none;
		color: inherit;
		font-size: 1.1rem;
		line-height: 1;
	}

	.x:hover {
		background: none;
		color: var(--text);
	}

	.add {
		display: flex;
		gap: 0.5rem;
	}

	.add input {
		flex: 1;
		min-width: 0;
	}

	.small {
		margin: 0;
		padding: 0.45rem 0.9rem;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.notice {
		min-height: 1.4rem;
		font-size: 0.88rem;
		margin: 0;
		color: var(--accentLight);
	}

	.how summary {
		cursor: pointer;
		font-weight: 600;
		color: var(--mainThemeLighter);
		font-size: 0.95rem;
	}

	.how p {
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	.results-head {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem 1rem;
	}

	.toggles {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		font-size: 0.92rem;
	}

	.toggles label {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.meta {
		font-size: 0.9rem;
		color: var(--text-muted);
		margin: 0.5rem 0 1rem;
	}

	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.75rem;
	}

	.post {
		padding: 1rem 1.25rem;
	}

	.post.low {
		opacity: 0.65;
	}

	.post-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.post h3 {
		margin: 0;
		font-size: 1.05rem;
		overflow-wrap: anywhere;
	}

	.badges {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-shrink: 0;
	}

	.score {
		min-width: 2rem;
		text-align: center;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		background: var(--accent);
		color: var(--on-accent);
		font-weight: 700;
		font-size: 0.9rem;
	}

	.moved {
		font-size: 0.8rem;
		color: var(--text-muted);
		min-width: 2.2rem;
	}

	.moved.up {
		color: var(--mainThemeLighter);
	}

	.moved.down {
		color: var(--accent);
	}

	.source {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin: 0.25rem 0 0.5rem;
	}

	.details {
		list-style: none;
		margin: 0 0 0.6rem;
		padding: 0;
		font-size: 0.92rem;
	}

	mark {
		background: none;
		border-radius: 3px;
		padding: 0 0.1rem;
	}

	mark.plus {
		background: rgba(80, 230, 230, 0.18);
		color: var(--mainThemeLighter);
	}

	mark.minus {
		background: rgba(255, 165, 90, 0.2);
		color: var(--accentLight);
	}

	.why {
		margin-bottom: 0.5rem;
	}

	.chip.plus {
		color: var(--mainThemeLighter);
	}

	.chip.minus {
		color: var(--accent);
		background: rgba(255, 165, 90, 0.08);
		border-color: rgba(255, 165, 90, 0.3);
	}

	.desc summary {
		cursor: pointer;
		font-size: 0.88rem;
		color: var(--text-muted);
	}

	.desc p {
		white-space: pre-line;
		font-size: 0.92rem;
		color: var(--text-muted);
		margin: 0.5rem 0 0;
	}

	.empty {
		padding: 1.5rem;
		text-align: center;
		color: var(--text-muted);
	}

	.cta {
		margin-top: 2rem;
		border-color: var(--border-strong);
		background:
			radial-gradient(30rem 14rem at 50% 0%, rgba(0, 130, 130, 0.3), transparent 70%),
			var(--surface);
	}

	.cta h2 {
		text-align: left;
		font-size: 1.4rem;
		margin: 0 0 0.5rem;
	}

	.cta > p {
		color: var(--text-muted);
	}

	.recipe {
		margin: 1.25rem 0;
		padding: 1rem 1.25rem;
		background: rgba(0, 0, 0, 0.25);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}

	.recipe h3 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
	}

	.recipe ol {
		margin: 0;
		padding-left: 1.3rem;
	}

	.recipe li {
		margin-bottom: 0.25rem;
		overflow-wrap: anywhere;
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: 20rem minmax(0, 1fr);
		}

		.controls {
			position: sticky;
			top: 5rem;
		}
	}
</style>
