var BaseStore = require('./base'),
  regions = require('_/constants/regions'),
  storeCache = {};

module.exports = function (params) {
  var scope = params.org + ':' + params.region + ':' + params.app,
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/apps/' + params.app + '/repo/branches';
  if (storeCache[scope]) return storeCache[scope];
  return storeCache[scope] = new BaseStore(url, {objectKey: 'name', refresh: false});
};