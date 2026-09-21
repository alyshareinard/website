// Pure helpers for the CSV cleaner. No DOM or parser imports so they can be tested in isolation.

export type Op =
	| 'none'
	| 'trim'
	| 'upper'
	| 'lower'
	| 'title'
	| 'phone'
	| 'date_us'
	| 'date_eu'
	| 'replace';

export const OPS: { value: Op; label: string }[] = [
	{ value: 'none', label: 'No change' },
	{ value: 'trim', label: 'Trim extra spaces' },
	{ value: 'upper', label: 'UPPERCASE' },
	{ value: 'lower', label: 'lowercase' },
	{ value: 'title', label: 'Title Case' },
	{ value: 'phone', label: 'US phone → +1-XXX-XXX-XXXX' },
	{ value: 'date_us', label: 'Date MM/DD/YYYY → YYYY-MM-DD' },
	{ value: 'date_eu', label: 'Date DD/MM/YYYY → YYYY-MM-DD' },
	{ value: 'replace', label: 'Find & replace…' }
];

interface BaseSpec {
	id: string;
	keep: boolean;
	/** Column name in the output file */
	name: string;
}

export interface SourceSpec extends BaseSpec {
	kind: 'source';
	/** Column name in the uploaded file */
	key: string;
	op: Op;
	find: string;
	replace: string;
}

export interface CombineSpec extends BaseSpec {
	kind: 'combine';
	a: string;
	b: string;
	sep: string;
}

export interface SplitSpec extends BaseSpec {
	kind: 'split';
	source: string;
	sep: string;
	part: 0 | 1;
}

export type ColSpec = SourceSpec | CombineSpec | SplitSpec;

export interface Options {
	dedupe: boolean;
	/** Spec id to compare on, or '' to compare whole rows */
	dedupeBy: string;
}

export interface Warnings {
	phone: number;
	date: number;
}

export interface Built {
	headers: string[];
	rows: string[][];
	warnings: Warnings;
	removedDuplicates: number;
}

export type Row = Record<string, string | undefined>;

export function titleCase(value: string): string {
	return value
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase()
		.replace(/(^|[\s\-'’(])(\p{L})/gu, (_, before: string, letter: string) => {
			return before + letter.toUpperCase();
		});
}

/** Returns +1-XXX-XXX-XXXX, or null when the value isn't a recognisable US number. */
export function formatUsPhone(input: string): string | null {
	const trimmed = input.trim();
	if (/^\+\s*(?!1)/.test(trimmed)) return null;
	let digits = trimmed.replace(/\D/g, '');
	if (digits.length === 11 && digits[0] === '1') digits = digits.slice(1);
	if (digits.length !== 10) return null;
	return `+1-${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function daysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate();
}

/** Returns YYYY-MM-DD, or null when the value isn't a recognisable date. */
export function toIsoDate(input: string, order: 'us' | 'eu'): string | null {
	const s = input.trim();
	let year: number;
	let month: number;
	let day: number;

	const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (iso) {
		[year, month, day] = [Number(iso[1]), Number(iso[2]), Number(iso[3])];
	} else {
		const m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
		if (!m) return null;
		year = Number(m[3]);
		month = Number(order === 'us' ? m[1] : m[2]);
		day = Number(order === 'us' ? m[2] : m[1]);
	}

	if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function applyOp(
	op: Op,
	value: string,
	find: string,
	replace: string,
	warnings: Warnings
): string {
	switch (op) {
		case 'trim':
			return value.replace(/\s+/g, ' ').trim();
		case 'upper':
			return value.toUpperCase();
		case 'lower':
			return value.toLowerCase();
		case 'title':
			return titleCase(value);
		case 'phone': {
			if (!value.trim()) return value;
			const formatted = formatUsPhone(value);
			if (formatted === null) {
				warnings.phone++;
				return value;
			}
			return formatted;
		}
		case 'date_us':
		case 'date_eu': {
			if (!value.trim()) return value;
			const formatted = toIsoDate(value, op === 'date_us' ? 'us' : 'eu');
			if (formatted === null) {
				warnings.date++;
				return value;
			}
			return formatted;
		}
		case 'replace':
			return find ? value.split(find).join(replace) : value;
		default:
			return value;
	}
}

/** Picks a sensible starting cleanup from the column heading. */
export function suggestOp(header: string): Op {
	if (/e-?mail/i.test(header)) return 'lower';
	if (/phone|mobile|\btel\b|\bcell\b/i.test(header)) return 'phone';
	if (/^(full |first |last )?name$/i.test(header.trim())) return 'title';
	return 'none';
}

function join(a: string, b: string, sep: string): string {
	return [a, b].filter((part) => part !== '').join(sep);
}

function splitOnce(value: string, sep: string): [string, string] {
	const index = sep ? value.indexOf(sep) : -1;
	if (index < 0) return [value.trim(), ''];
	return [value.slice(0, index).trim(), value.slice(index + sep.length).trim()];
}

export function buildOutput(rows: Row[], specs: ColSpec[], options: Options): Built {
	const warnings: Warnings = { phone: 0, date: 0 };
	const discarded: Warnings = { phone: 0, date: 0 };
	const kept = specs.filter((spec) => spec.keep);
	const sources = specs.filter((spec): spec is SourceSpec => spec.kind === 'source');

	const headers = kept.map((spec) => spec.name.trim() || fallbackName(spec));
	let out: string[][] = rows.map((row) => {
		// Clean each source column once, then build derived columns from the cleaned values.
		const cleaned: Record<string, string> = {};
		for (const source of sources) {
			cleaned[source.key] = applyOp(
				source.op,
				row[source.key] ?? '',
				source.find,
				source.replace,
				source.keep ? warnings : discarded
			);
		}

		return kept.map((spec) => {
			if (spec.kind === 'source') return cleaned[spec.key];
			if (spec.kind === 'combine') {
				return join(cleaned[spec.a] ?? '', cleaned[spec.b] ?? '', spec.sep);
			}
			return splitOnce(cleaned[spec.source] ?? '', spec.sep)[spec.part];
		});
	});

	let removedDuplicates = 0;
	if (options.dedupe) {
		const column = kept.findIndex((spec) => spec.id === options.dedupeBy);
		const seen = new Set<string>();
		const unique: string[][] = [];
		for (const row of out) {
			const key = column >= 0 ? row[column] : row.join('');
			if (seen.has(key)) {
				removedDuplicates++;
			} else {
				seen.add(key);
				unique.push(row);
			}
		}
		out = unique;
	}

	return { headers, rows: out, warnings, removedDuplicates };
}

function fallbackName(spec: ColSpec): string {
	return spec.kind === 'source' ? spec.key : 'Column';
}

/** Plain-English list of what the user has set up, used for the "recipe" panel. */
export function describeSteps(specs: ColSpec[], options: Options): string[] {
	const steps: string[] = [];
	const sources = specs.filter((spec): spec is SourceSpec => spec.kind === 'source');
	const label = (spec: ColSpec) => spec.name.trim() || fallbackName(spec);

	const dropped = sources.filter((spec) => !spec.keep).map((spec) => `"${spec.key}"`);
	if (dropped.length) steps.push(`Remove columns: ${dropped.join(', ')}`);

	for (const spec of sources) {
		if (!spec.keep) continue;
		if (spec.name.trim() && spec.name.trim() !== spec.key) {
			steps.push(`Rename "${spec.key}" to "${spec.name.trim()}"`);
		}
		const target = `"${spec.name.trim() || spec.key}"`;
		switch (spec.op) {
			case 'trim':
				steps.push(`Trim extra spaces in ${target}`);
				break;
			case 'upper':
				steps.push(`Change ${target} to UPPERCASE`);
				break;
			case 'lower':
				steps.push(`Change ${target} to lowercase`);
				break;
			case 'title':
				steps.push(`Change ${target} to Title Case`);
				break;
			case 'phone':
				steps.push(`Format ${target} as US phone numbers (+1-XXX-XXX-XXXX)`);
				break;
			case 'date_us':
				steps.push(`Convert dates in ${target} from MM/DD/YYYY to YYYY-MM-DD`);
				break;
			case 'date_eu':
				steps.push(`Convert dates in ${target} from DD/MM/YYYY to YYYY-MM-DD`);
				break;
			case 'replace':
				if (spec.find) steps.push(`In ${target}, replace "${spec.find}" with "${spec.replace}"`);
				break;
		}
	}

	for (const spec of specs) {
		if (!spec.keep) continue;
		if (spec.kind === 'combine') {
			steps.push(`Combine "${spec.a}" and "${spec.b}" into "${label(spec)}"`);
		} else if (spec.kind === 'split' && spec.part === 0) {
			const partner = specs.find(
				(other) => other.kind === 'split' && other.part === 1 && other.source === spec.source
			);
			steps.push(
				`Split "${spec.source}" at "${spec.sep}" into "${label(spec)}"` +
					(partner ? ` and "${label(partner)}"` : '')
			);
		}
	}

	const kept = sources.filter((spec) => spec.keep).map((spec) => spec.key);
	const original = sources.map((spec) => spec.key).filter((key) => kept.includes(key));
	if (kept.some((key, i) => key !== original[i])) steps.push('Reorder columns');

	if (options.dedupe) {
		const by = specs.find((spec) => spec.id === options.dedupeBy);
		steps.push(by ? `Remove duplicate rows (matching on "${label(by)}")` : 'Remove duplicate rows');
	}

	return steps;
}
