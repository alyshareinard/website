import type { PageLoad } from './$types';
import { metaFromSearchParams } from '$lib/appPages/appMeta';

export const load: PageLoad = ({ url }) => {
  const meta = metaFromSearchParams(url);
  return {
    title: `${meta.appName} Support`,
    description: `Get help and support for ${meta.appName}.`,
    meta
  };
};
