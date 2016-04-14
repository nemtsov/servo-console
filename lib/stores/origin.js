var BaseStore = require('./base'),
  regions = require('_/constants/regions'),
  storeCache = {};

module.exports = function (params, distributionId) {
  var scope = params.org + ':' + distributionId,
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/distributions/' + distributionId + '/origins';
  if (storeCache[scope]) return storeCache[scope];
  return storeCache[scope] = new BaseStore(url, {refresh: 60});
};