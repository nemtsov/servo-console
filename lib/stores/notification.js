var BaseStore = require('./base'),
  regions = require('_/constants/regions'),
  storeCache = {};

module.exports = function (params) {
  var url, scope;

  if (params.stack) {
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/apps/' + params.app + '/stacks/' + params.stack + '/notifications';
    scope = params.org + ':' + params.region + ':' + params.app + ':' + params.stack;
  } else if (params.app) {
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/apps/' + params.app + '/notifications';
    scope = params.org + ':' + params.region + ':' + params.app;
  } else {
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/notifications';
    scope = params.org + ':' + params.region;
  }

  if (storeCache[scope]) return storeCache[scope];
  return storeCache[scope] = new BaseStore(url);
};