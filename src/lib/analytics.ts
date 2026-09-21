/** Sends a Simple Analytics event. Only the event name is sent, never any user content. */
export function track(name: string) {
	try {
		(window as unknown as { sa_event?: (name: string) => void }).sa_event?.(name);
	} catch {
		/* analytics is optional */
	}
}
