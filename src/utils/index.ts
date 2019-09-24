export const getUrlParams = (queryString: string) => {
  if (!queryString) {
    return {};
  }
  let hashes = queryString.split('&');
  let params: { [key: string]: string | null } = {};
  hashes.map(hash => {
    let [key, val] = hash.split('=');
    if (key) {
      params[key] = val ? decodeURIComponent(val) : null;
    }
  });

  return params;
};
