var BaseStore = require('./base'),
  regions = require('_/constants/regions'),
  storeCache = {};

module.exports = function (params) {
  var scope = params.org + ':' + params.region + ':' + params.app + ':' + params.stack,
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/apps/' + params.app + '/stacks/' + params.stack + '/workers';
  if (params.destroyed)
    url += '?destroyed=' + params.destroyed;
  if (storeCache[scope]) return storeCache[scope];
  return storeCache[scope] = new BaseStore(url);
};
