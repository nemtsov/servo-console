import BaseStore from './base';
import regions from '_/constants/regions';

const storeCache = {};

// TODO: config endpoint should be /orgs/:org/configs
module.exports = function (params, options) {
  const url = `${regions[params.region].endpoint}/orgs/${params.org}/admin/${params.configUrl}`;
  const scope = `${params.org}:${params.region}:${params.config}`;

  if (storeCache[scope]) return storeCache[scope];
  return storeCache[scope] = new BaseStore(url, {refresh: 120, ...options});
};
