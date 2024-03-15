import { safeDecodeUriComponent } from '../utils/safeDecodeUriComponents';

export const getUrlParams = (queryString: string) => {
  if (!queryString) {
    return {};
  }
  const hashes = queryString.split('&');
  const params: { [key: string]: string | null } = {};
  for (const hash of hashes) {
    const [key, val] = hash.split('=');
    if (key) {
      params[key] = val ? safeDecodeUriComponent(val) : null;
    }
  }

  return params;
};
