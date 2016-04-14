var BaseStore = require('./base'),
  regions = require('_/constants/regions'),
  storeCache = {};

module.exports = function (params, branch) {
  var scope = params.org + ':' + params.region + ':' + params.app + ':' + branch,
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/apps/' + params.app + '/repo/commits?branch=' + branch;
  if (storeCache[scope]) return storeCache[scope];
  return storeCache[scope] = new BaseStore(url, {objectKey: 'sha', refresh: false});
};