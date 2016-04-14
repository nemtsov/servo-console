var BaseStore = require('./base'),
  regions = require('_/constants/regions'),
  storeCache = {};

module.exports = function (params) {
  var scope = params.org,
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/distributions';
  if (storeCache[scope]) return storeCache[scope];
  return storeCache[scope] = new BaseStore(url, {total: true, refresh: 60});
};