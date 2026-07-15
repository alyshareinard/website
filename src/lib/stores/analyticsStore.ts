import { writable } from 'svelte/store';

export interface AnalyticsEvent {
	id: string;
	data: Record<string, unknown>;
	event: string;
	type: string;
}

export const analyticsStore = writable<AnalyticsEvent[]>([]);
