import BaseStore  from './base';
import regions from '_/constants/regions';

const storeCache = {};

// TODO: remove hardcoded region
module.exports = (params) => {
  const scope = params.org + ':' +params.region || 'virginia';

  const url = regions[params.region || Object.keys(regions)[0]].endpoint + '/users/me/tokens'
  if (storeCache[scope]) return storeCache[scope];
  return storeCache[scope] = new BaseStore(url, {objectKey: 'name', refresh: 60});
};
