// Pure scoring helpers for the feed ranker. No DOM imports so they can be tested in isolation.

export interface Post {
	id: string;
	title: string;
	source: string;
	/** How many days old the post is */
	daysAgo: number;
	/** Multi-line text. Lines like "Budget: $500" can be pulled out as details. */
	description: string;
}

export interface Hit {
	word: string;
	/** Mentions across the title and the description */
	count: number;
}

export interface Ranked {
	post: Post;
	score: number;
	recency: number;
	plusHits: Hit[];
	minusHits: Hit[];
	details: string[];
	/** Position when posts are listed in the order they arrived */
	arrivalIndex: number;
}

export interface Segment {
	text: string;
	kind: 'plus' | 'minus' | null;
}

const TITLE_WEIGHT = 2;
const RECENCY_POINTS = 5;

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Matches the word or phrase as a whole word, case-insensitively. Whatever the visitor types is
 * escaped first, so characters like "+" in "c++" are treated as plain text.
 */
function termPattern(word: string): string {
	const escaped = escapeRegExp(word.trim()).replace(/\s+/g, '\\s+');
	return `(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`;
}

export function countMatches(text: string, word: string): number {
	if (!word.trim()) return 0;
	return (text.match(new RegExp(termPattern(word), 'giu')) ?? []).length;
}

function hitsFor(post: Post, words: string[]): { hits: Hit[]; points: number } {
	const hits: Hit[] = [];
	let points = 0;
	for (const word of words) {
		const inTitle = countMatches(post.title, word);
		const inBody = countMatches(post.description, word);
		if (inTitle + inBody === 0) continue;
		hits.push({ word, count: inTitle + inBody });
		points += inTitle * TITLE_WEIGHT + inBody;
	}
	return { hits, points };
}

/** Returns the lines that mention each label, in label order, without repeats. */
export function extractDetails(description: string, labels: string[]): string[] {
	const lines = description
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);
	const found: string[] = [];
	for (const label of labels) {
		if (!label.trim()) continue;
		const wanted = label.trim().toLowerCase();
		const line =
			lines.find((candidate) => candidate.toLowerCase().startsWith(wanted)) ??
			lines.find((candidate) => countMatches(candidate, label) > 0);
		if (line && !found.includes(line)) found.push(line);
	}
	return found;
}

/**
 * Scores every post, then sorts best first. Ties go to the newer post.
 * `posts` is expected in arrival order (newest first).
 */
export function rank(
	posts: Post[],
	plusWords: string[],
	minusWords: string[],
	detailLabels: string[]
): Ranked[] {
	const scored: Ranked[] = posts.map((post, arrivalIndex) => {
		const plus = hitsFor(post, plusWords);
		const minus = hitsFor(post, minusWords);
		const recency = Math.max(0, RECENCY_POINTS - post.daysAgo);
		return {
			post,
			recency,
			score: recency + plus.points - minus.points,
			plusHits: plus.hits,
			minusHits: minus.hits,
			details: extractDetails(post.description, detailLabels),
			arrivalIndex
		};
	});

	return scored.sort((a, b) => b.score - a.score || a.arrivalIndex - b.arrivalIndex);
}

/** Splits text into pieces so matched words can be highlighted without injecting HTML. */
export function highlight(text: string, plusWords: string[], minusWords: string[]): Segment[] {
	const kinds = new Map<string, 'plus' | 'minus'>();
	for (const word of minusWords) kinds.set(word.trim().toLowerCase(), 'minus');
	for (const word of plusWords) kinds.set(word.trim().toLowerCase(), 'plus');

	const words = [...kinds.keys()].filter(Boolean).sort((a, b) => b.length - a.length);
	if (!words.length) return [{ text, kind: null }];

	const pattern = new RegExp(words.map(termPattern).join('|'), 'giu');
	const segments: Segment[] = [];
	let last = 0;
	for (const match of text.matchAll(pattern)) {
		const start = match.index ?? 0;
		if (start > last) segments.push({ text: text.slice(last, start), kind: null });
		const normalized = match[0].toLowerCase().replace(/\s+/g, ' ');
		segments.push({ text: match[0], kind: kinds.get(normalized) ?? null });
		last = start + match[0].length;
	}
	if (last < text.length) segments.push({ text: text.slice(last), kind: null });
	return segments;
}
