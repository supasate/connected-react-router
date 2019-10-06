export const getUrlParams = (search = '') => {
  let hashes = search.slice(search.indexOf('?') + 1).split('&');
  return hashes.reduce((params, hash) => {
    let [key, val] = hash.split('=');
    return val !== undefined
      ? Object.assign(params, {[key]: decodeURIComponent(val)})
      : params;
  }, {});
};
