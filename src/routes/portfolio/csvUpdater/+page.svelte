<script lang="ts">
	import Papa from 'papaparse';
	import {
		OPS,
		buildOutput,
		describeSteps,
		suggestOp,
		type ColSpec,
		type Options,
		type Row
	} from '$lib/csv/clean';

	const MAX_BYTES = 2_000_000;
	const PREVIEW_ROWS = 8;

	const SAMPLE = `Full name,Email,Phone,Signup date,Status
"SMITH, john",john.smith@example.com,(303) 555-0142,03/14/2024,active
"garcia, maria ",Maria.Garcia@Example.com,303.555.0177,11/02/2023,Trial
"Lee, ANNA",anna.lee@example.com,1-720-555-0199,7/9/2024,waiting
"Nguyen, tran",tran@example.com,555-0123,12/25/2023,Active
"Patel, Raj",raj.patel@example.com,+1 (415) 555-0110,01/30/2024,inactive
"smith, John",john.smith@example.com,303-555-0142,03/14/2024,active
`;

	let fileName = $state('');
	let delimiter = $state(',');
	let rows = $state.raw<Row[]>([]);
	let specs = $state<ColSpec[]>([]);
	let options = $state<Options>({ dedupe: false, dedupeBy: '' });
	let output = $state({ delimiter: ',', bom: true });
	let error = $state('');
	let suggestions = $state<string[]>([]);
	let downloaded = $state(false);
	let dragging = $state(false);

	// Inputs for the "combine" and "split" tools
	let combineA = $state('');
	let combineB = $state('');
	let combineSep = $state(' ');
	let combineName = $state('');
	let splitSource = $state('');
	let splitSep = $state(', ');

	let nextId = 0;
	const newId = () => `c${nextId++}`;

	const sourceKeys = $derived(
		specs.flatMap((spec) => (spec.kind === 'source' ? [spec.key] : []))
	);
	const built = $derived(rows.length ? buildOutput(rows, specs, options) : null);
	const steps = $derived(describeSteps(specs, options));
	const keptSpecs = $derived(specs.filter((spec) => spec.keep));

	const contactHref = $derived.by(() => {
		const list = steps.length
			? steps.map((step) => `- ${step}`).join('\n')
			: "- (I haven't picked any steps yet)";
		const message =
			`I tried your CSV cleaner and I'd like help automating this:\n\n${list}\n\n` +
			'The file comes from: \nIt needs to go to: \nHow often: ';
		return `/contact?service=Integration&message=${encodeURIComponent(message)}#contactForm`;
	});

	const delimiterNames: Record<string, string> = { ',': 'comma', ';': 'semicolon', '\t': 'tab' };

	function track(name: string) {
		// Simple Analytics event. Only the event name is sent, never any file contents.
		try {
			(window as unknown as { sa_event?: (n: string) => void }).sa_event?.(name);
		} catch {
			/* analytics is optional */
		}
	}

	async function readText(file: File): Promise<string> {
		const buffer = await file.arrayBuffer();
		try {
			return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
		} catch {
			// Excel on Windows often saves CSVs as Windows-1252 rather than UTF-8
			return new TextDecoder('windows-1252').decode(buffer);
		}
	}

	function load(text: string, name: string) {
		error = '';
		const result = Papa.parse<Row>(text, { header: true, skipEmptyLines: 'greedy' });
		const fields = result.meta.fields ?? [];
		if (!fields.length || !result.data.length) {
			error = "I couldn't find any rows in that file. Is it a CSV with a header row?";
			return;
		}

		rows = result.data;
		fileName = name;
		delimiter = result.meta.delimiter;
		// Keep the file's own separator (European Excel exports often use semicolons)
		output = { delimiter: [',', ';', '\t'].includes(result.meta.delimiter) ? result.meta.delimiter : ',', bom: true };
		options = { dedupe: false, dedupeBy: '' };
		downloaded = false;

		suggestions = [];
		specs = fields.map((key) => {
			const op = suggestOp(key);
			const label = OPS.find((o) => o.value === op)?.label;
			if (op !== 'none' && label) suggestions.push(`${key}: ${label}`);
			return { id: newId(), kind: 'source', keep: true, name: key, key, op, find: '', replace: '' };
		});

		combineA = fields[0];
		combineB = fields[1] ?? fields[0];
		combineName = '';
		splitSource = fields[0];
	}

	async function handleFile(file: File | undefined) {
		if (!file) return;
		if (!/\.(csv|tsv|txt)$/i.test(file.name)) {
			error = 'Please choose a .csv file.';
			return;
		}
		if (file.size > MAX_BYTES) {
			error = `That file is over ${MAX_BYTES / 1_000_000} MB, the limit for this free version.`;
			return;
		}
		load(await readText(file), file.name);
		if (!error) track('csv_upload');
	}

	function loadSample() {
		load(SAMPLE, 'sample.csv');
		track('csv_sample');
	}

	function reset() {
		rows = [];
		specs = [];
		fileName = '';
		error = '';
		downloaded = false;
	}

	function move(index: number, direction: -1 | 1) {
		const target = index + direction;
		if (target < 0 || target >= specs.length) return;
		const next = [...specs];
		[next[index], next[target]] = [next[target], next[index]];
		specs = next;
	}

	function removeSpec(id: string) {
		specs = specs.filter((spec) => spec.id !== id);
		if (options.dedupeBy === id) options.dedupeBy = '';
	}

	function addCombine() {
		specs = [
			...specs,
			{
				id: newId(),
				kind: 'combine',
				keep: true,
				name: combineName.trim() || `${combineA} + ${combineB}`,
				a: combineA,
				b: combineB,
				sep: combineSep
			}
		];
		combineName = '';
	}

	function addSplit() {
		let names = [`${splitSource} (part 1)`, `${splitSource} (part 2)`];
		if (/name/i.test(splitSource)) {
			// "Smith, John" puts the last name first; "John Smith" puts the first name first.
			names = splitSep.includes(',') ? ['Last name', 'First name'] : ['First name', 'Last name'];
		}
		const make = (part: 0 | 1): ColSpec => ({
			id: newId(),
			kind: 'split',
			keep: true,
			name: names[part],
			source: splitSource,
			sep: splitSep,
			part
		});
		specs = [...specs, make(0), make(1)];
	}

	/** True when a cell in the cleaned preview differs from what was uploaded. */
	function isChanged(rowIndex: number, colIndex: number): boolean {
		const spec = keptSpecs[colIndex];
		if (!built || !spec) return false;
		if (spec.kind !== 'source') return true;
		const original = rows[built.sourceIndex[rowIndex]]?.[spec.key] ?? '';
		return built.rows[rowIndex][colIndex] !== original;
	}

	function derivedLabel(spec: ColSpec): string {
		if (spec.kind === 'combine') return `Combined: ${spec.a} + ${spec.b}`;
		if (spec.kind === 'split') return `Split from ${spec.source} (part ${spec.part + 1})`;
		return '';
	}

	function download() {
		if (!built) return;
		const csv = Papa.unparse({ fields: built.headers, data: built.rows }, { delimiter: output.delimiter });
		const blob = new Blob([(output.bom ? '﻿' : '') + csv], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${fileName.replace(/\.[^.]+$/, '') || 'output'}-cleaned.csv`;
		document.body.appendChild(link);
		link.click();
		link.remove();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
		downloaded = true;
		track('csv_download');
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		dragging = false;
		handleFile(event.dataTransfer?.files[0]);
	}
</script>

{#snippet table(headers: string[], body: string[][], highlight: boolean)}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="preview" tabindex="0" role="region" aria-label="Preview of the data">
		<table>
			<thead>
				<tr>
					{#each headers as header}<th>{header}</th>{/each}
				</tr>
			</thead>
			<tbody>
				{#each body.slice(0, PREVIEW_ROWS) as row, r}
					<tr>
						{#each row as cell, c}
							<td class:changed={highlight && isChanged(r, c)}>{cell}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

<div class="csv">
	<header class="page-head">
		<span class="eyebrow">Free tool</span>
		<h1>CSV cleaner</h1>
		<p class="lead">
			Fix up a spreadsheet export in a few clicks: tidy phone numbers and dates, split or combine
			columns, drop what you don't need, and remove duplicates.
		</p>
		<p class="no-ai">
			Every cleanup here is plain, rule-based code, not AI, so the same file always gives you the
			same result.
		</p>
		<ul class="chips trust">
			<li class="chip">Runs in your browser</li>
			<li class="chip">Your file is never uploaded</li>
			<li class="chip">Code, not AI</li>
			<li class="chip">Free</li>
		</ul>
	</header>

	<section class="card step" aria-labelledby="step1">
		<h2 id="step1"><span class="num">1</span> Upload a CSV</h2>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<label
			class="drop"
			class:dragging
			ondragover={(event) => {
				event.preventDefault();
				dragging = true;
			}}
			ondragleave={() => (dragging = false)}
			ondrop={onDrop}
		>
			<input
				type="file"
				accept=".csv,.tsv,.txt,text/csv"
				onchange={(event) => handleFile(event.currentTarget.files?.[0])}
			/>
			<span class="drop-title">Drop a .csv file here, or click to choose one</span>
			<span class="drop-sub">Up to {MAX_BYTES / 1_000_000} MB</span>
		</label>
		<p class="or">
			No file handy?
			<button class="linklike" onclick={loadSample}>Try it with sample data</button>
		</p>
		{#if error}
			<p class="error" role="alert">{error}</p>
		{/if}
	</section>

	{#if built}
		<section class="card step" aria-labelledby="step2">
			<div class="step-head">
				<h2 id="step2"><span class="num">2</span> Shape your columns</h2>
				<button class="linklike" onclick={reset}>Start over</button>
			</div>
			<p class="meta">
				<strong>{fileName}</strong> · {rows.length.toLocaleString()} rows · {sourceKeys.length} columns
				· {delimiterNames[delimiter] ?? 'custom'}-separated
			</p>
			{#if suggestions.length}
				<p class="note">
					I started you off with a few cleanups based on the column names ({suggestions.join(
						'; '
					)}). Change any of them below.
				</p>
			{/if}

			<h3 class="preview-title">Before: your file</h3>
			{@render table(sourceKeys, rows.slice(0, PREVIEW_ROWS).map((row) => sourceKeys.map((key) => row[key] ?? '')), false)}
			<p class="meta">
				Showing {Math.min(PREVIEW_ROWS, rows.length)} of {rows.length.toLocaleString()} rows
			</p>

			<h3 class="preview-title">Choose what to change</h3>
			<ul class="cols">
				{#each specs as spec, i (spec.id)}
					<li class="colrow" class:dropped={!spec.keep}>
						<label class="keep">
							<input
								type="checkbox"
								bind:checked={spec.keep}
								aria-label="Keep {spec.kind === 'source' ? spec.key : spec.name}"
							/>
							<span class="orig">{spec.kind === 'source' ? spec.key : derivedLabel(spec)}</span>
						</label>
						<input
							class="rename"
							type="text"
							bind:value={spec.name}
							aria-label="Name in the new file for {spec.kind === 'source' ? spec.key : spec.name}"
							disabled={!spec.keep}
						/>
						{#if spec.kind === 'source'}
							<select
								bind:value={spec.op}
								aria-label="Cleanup for {spec.key}"
								disabled={!spec.keep}
							>
								{#each OPS as op}
									<option value={op.value}>{op.label}</option>
								{/each}
							</select>
							{#if spec.op === 'replace' && spec.keep}
								<span class="replace">
									<input type="text" bind:value={spec.find} placeholder="find" aria-label="Find" />
									→
									<input
										type="text"
										bind:value={spec.replace}
										placeholder="replace with"
										aria-label="Replace with"
									/>
								</span>
							{/if}
						{:else}
							<button class="iconbtn remove" onclick={() => removeSpec(spec.id)}>Remove</button>
						{/if}
						<span class="moves">
							<button
								class="iconbtn"
								onclick={() => move(i, -1)}
								disabled={i === 0}
								aria-label="Move up">↑</button
							>
							<button
								class="iconbtn"
								onclick={() => move(i, 1)}
								disabled={i === specs.length - 1}
								aria-label="Move down">↓</button
							>
						</span>
					</li>
				{/each}
			</ul>

			<details class="more">
				<summary>Combine or split columns</summary>
				<div class="tools">
					<div class="tool">
						<h3>Combine two columns</h3>
						<div class="toolrow">
							<select bind:value={combineA} aria-label="First column">
								{#each sourceKeys as key}<option>{key}</option>{/each}
							</select>
							<span>+</span>
							<select bind:value={combineB} aria-label="Second column">
								{#each sourceKeys as key}<option>{key}</option>{/each}
							</select>
						</div>
						<div class="toolrow">
							<label>
								Separator
								<input class="short" type="text" bind:value={combineSep} />
							</label>
							<label>
								New name
								<input type="text" bind:value={combineName} placeholder="Optional" />
							</label>
							<button class="btn-secondary small" onclick={addCombine}>Add</button>
						</div>
					</div>
					<div class="tool">
						<h3>Split one column in two</h3>
						<div class="toolrow">
							<select bind:value={splitSource} aria-label="Column to split">
								{#each sourceKeys as key}<option>{key}</option>{/each}
							</select>
							<label>
								at
								<input class="short" type="text" bind:value={splitSep} />
							</label>
							<button class="btn-secondary small" onclick={addSplit}>Add</button>
						</div>
						<p class="hint">Splits at the first match. For "Smith, John", use a comma and a space.</p>
					</div>
				</div>
			</details>

			<div class="dedupe">
				<label>
					<input type="checkbox" bind:checked={options.dedupe} />
					Remove duplicate rows
				</label>
				{#if options.dedupe}
					<label>
						matching on
						<select bind:value={options.dedupeBy}>
							<option value="">the whole row</option>
							{#each keptSpecs as spec}
								<option value={spec.id}>{spec.name || (spec.kind === 'source' ? spec.key : '')}</option>
							{/each}
						</select>
					</label>
				{/if}
			</div>

			<p class="cant">
				Need a cleanup this doesn't offer? <a href={contactHref} onclick={() => track('csv_cta_cant')}
					>Tell me what you need</a
				>.
			</p>
		</section>

		<section class="card step" aria-labelledby="step3">
			<h2 id="step3"><span class="num">3</span> Preview and download</h2>

			<div aria-live="polite">
				{#if built.warnings.phone}
					<p class="warn">
						{built.warnings.phone} phone number{built.warnings.phone === 1 ? '' : 's'} didn't look
						like US numbers, so I left {built.warnings.phone === 1 ? 'it' : 'them'} as {built.warnings
							.phone === 1
							? 'it was'
							: 'they were'}.
					</p>
				{/if}
				{#if built.warnings.date}
					<p class="warn">
						{built.warnings.date} date{built.warnings.date === 1 ? '' : 's'} couldn't be read in the
						format you chose, so I left {built.warnings.date === 1 ? 'it' : 'them'} unchanged.
					</p>
				{/if}
				{#if options.dedupe}
					<p class="note">
						Removed {built.removedDuplicates} duplicate row{built.removedDuplicates === 1 ? '' : 's'}.
					</p>
				{/if}
			</div>

			<h3 class="preview-title">
				After: your cleaned file
				<span class="legend"><span class="swatch"></span> changed</span>
			</h3>
			{@render table(built.headers, built.rows, true)}
			<p class="meta">
				Showing {Math.min(PREVIEW_ROWS, built.rows.length)} of {built.rows.length.toLocaleString()} rows
			</p>

			<div class="download">
				<button class="btn-primary" onclick={download} disabled={!built.headers.length}
					>Download cleaned CSV</button
				>
				<label>
					Separator
					<select bind:value={output.delimiter}>
						<option value=",">Comma</option>
						<option value=";">Semicolon</option>
						<option value={'\t'}>Tab</option>
					</select>
				</label>
				<label class="check">
					<input type="checkbox" bind:checked={output.bom} />
					Keep accents correct in Excel
				</label>
			</div>
		</section>

		<section class="card cta" aria-labelledby="cta-heading">
			<h2 id="cta-heading">
				{downloaded ? 'Nice, your file is ready.' : 'Doing this over and over?'}
				Let's make it automatic.
			</h2>
			<p>
				This free version handles one file at a time, when you click the buttons. A custom version can
				pick the file up from your email or a shared folder, clean it the same way every time, and send
				it straight to the system that needs it, with no clicking.
			</p>

			<div class="recipe">
				<h3>Your recipe so far</h3>
				{#if steps.length}
					<ol>
						{#each steps as step}<li>{step}</li>{/each}
					</ol>
					<p class="hint">
						If you write to me from here, only these steps go into the message, never your data.
					</p>
				{:else}
					<p class="hint">Pick a few cleanups above and they'll show up here in plain English.</p>
				{/if}
			</div>

			<a class="btn-primary" href={contactHref} onclick={() => track('csv_cta')}
				>Ask about automating this</a
			>
		</section>
	{/if}
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

	.step {
		margin-bottom: 1.25rem;
	}

	.step h2 {
		text-align: left;
		font-size: 1.3rem;
		margin: 0 0 1rem;
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.step-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}

	.num {
		display: inline-grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		border-radius: 50%;
		background: var(--accent);
		color: var(--on-accent);
		font-size: 1rem;
	}

	/* Upload */
	.drop {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 2rem 1rem;
		text-align: center;
		border: 2px dashed var(--border-strong);
		border-radius: var(--radius);
		background: var(--surface-2);
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}

	.drop:hover,
	.drop.dragging,
	.drop:focus-within {
		border-color: var(--accent);
		background: rgba(255, 165, 90, 0.08);
	}

	.drop input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
	}

	.drop-title {
		font-weight: 600;
	}

	.drop-sub {
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.or {
		margin: 1rem 0 0;
		font-size: 1rem;
		color: var(--text-muted);
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

	.error,
	.warn,
	.note {
		font-size: 0.95rem;
		border-radius: var(--radius-sm);
		padding: 0.6rem 0.8rem;
		margin: 0.75rem 0;
	}

	.error {
		background: rgba(255, 99, 99, 0.12);
		color: #ffb3b3;
	}

	.warn {
		background: rgba(255, 165, 90, 0.12);
		color: var(--accentLight);
	}

	.note {
		background: rgba(80, 230, 230, 0.08);
		color: var(--text-muted);
	}

	.meta {
		font-size: 0.92rem;
		color: var(--text-muted);
		margin: 0 0 0.5rem;
	}

	/* Column rows */
	.cols {
		list-style: none;
		margin: 1rem 0;
		padding: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.5rem;
	}

	.colrow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 0.75rem;
		padding: 0.6rem 0.75rem;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}

	.colrow.dropped .orig {
		text-decoration: line-through;
		color: var(--text-muted);
	}

	.keep {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1 1 11rem;
		min-width: 0;
		font-weight: 500;
	}

	.orig {
		overflow-wrap: anywhere;
	}

	.rename {
		flex: 1 1 10rem;
		min-width: 0;
	}

	.colrow select {
		flex: 1 1 13rem;
		min-width: 0;
	}

	.replace {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex: 1 1 100%;
	}

	.replace input {
		flex: 1;
		min-width: 0;
	}

	.moves {
		display: flex;
		gap: 0.25rem;
		margin-left: auto;
	}

	.iconbtn {
		margin: 0;
		padding: 0.3rem 0.6rem;
		background: transparent;
		border: 1px solid var(--border);
		color: var(--text);
		font-weight: 500;
	}

	.iconbtn:hover:not(:disabled) {
		background: var(--surface);
		border-color: var(--border-strong);
		color: var(--mainThemeLighter);
	}

	.iconbtn:disabled {
		opacity: 0.35;
		cursor: default;
	}

	/* Tools */
	.more {
		margin: 1rem 0;
	}

	.more summary {
		cursor: pointer;
		font-weight: 600;
		color: var(--mainThemeLighter);
	}

	.tools {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
	}

	.tool {
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}

	.tool h3 {
		margin: 0 0 0.75rem;
		font-size: 1rem;
	}

	.toolrow {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 0.6rem;
		margin-bottom: 0.6rem;
	}

	.toolrow label {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.short {
		width: 5rem;
	}

	.small {
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
	}

	.hint {
		font-size: 0.88rem;
		color: var(--text-muted);
		margin: 0.25rem 0 0;
	}

	.dedupe {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1.25rem;
		margin: 1rem 0;
	}

	.dedupe label,
	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.cant {
		font-size: 0.95rem;
		color: var(--text-muted);
		margin: 1rem 0 0;
	}

	/* Preview */
	.preview {
		overflow-x: auto;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}

	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.9rem;
	}

	th,
	td {
		text-align: left;
		padding: 0.5rem 0.75rem;
		white-space: nowrap;
		border-bottom: 1px solid var(--border);
	}

	th {
		background: var(--surface-2);
		color: var(--mainThemeLighter);
		font-family: var(--font-display);
		font-weight: 600;
	}

	tbody tr:nth-child(even) {
		background: rgba(255, 255, 255, 0.025);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.preview-title {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin: 1.25rem 0 0.5rem;
		font-size: 1rem;
		color: var(--text-muted);
	}

	.legend {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-weight: 400;
	}

	.swatch {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 3px;
		background: rgba(255, 165, 90, 0.25);
		border: 1px solid rgba(255, 165, 90, 0.6);
	}

	td.changed {
		background: rgba(255, 165, 90, 0.18);
		color: var(--accentLight);
	}

	.download {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1.25rem;
		margin-top: 1rem;
	}

	.download label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.92rem;
		color: var(--text-muted);
	}

	.download .btn-primary {
		cursor: pointer;
		border: none;
	}

	.download .btn-primary:disabled {
		opacity: 0.5;
		cursor: default;
	}

	/* CTA */
	.cta {
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
		color: var(--text);
	}

	.recipe li {
		margin-bottom: 0.25rem;
		overflow-wrap: anywhere;
	}

	@media (min-width: 800px) {
		.tools {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
