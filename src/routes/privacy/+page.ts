import type { PageLoad } from './$types';
import { metaFromSearchParams } from '$lib/appPages/appMeta';

export const load: PageLoad = ({ url }) => {
	const meta = metaFromSearchParams(url);
	return {
		title: `${meta.appName} Privacy Policy`,
		description: `Privacy policy for ${meta.appName}. Learn what data is collected and how it's used.`,
		meta
	};
};
