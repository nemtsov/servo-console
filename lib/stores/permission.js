var BaseStore = require('./base'),
  regions = require('_/constants/regions'),
  storeCache = {};

module.exports = function (params, options) {
  var url, scope;
  options = Object.assign({objectKey: 'username', refresh: 30}, options);

  if (params.stack) {
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/apps/' + params.app + '/stacks/' + params.stack + '/permissions';
    scope = params.org + ':' + params.region + ':' + params.app + ':' + params.stack;
  } else if (params.app) {
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/apps/' + params.app + '/permissions';
    scope = params.org + ':' + params.region + ':' + params.app;
  } else if (params.origin) {
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/distributions/' + params.distribution + '/origins/' + params.origin + '/permissions';
    scope = params.org + ':' + params.distribution + ':' + params.origin;
  } else if (params.distribution) {
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/distributions/' + params.distribution + '/permissions';
    scope = params.org + ':' + params.distribution;
  } else {
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/permissions';
    scope = params.org + ':' + params.region;
  }

  if (options.user) {
    url = url + '/' + options.user;
    scope = scope + ':' + options.user;
    delete options.user
  }

  if (storeCache[scope]) return storeCache[scope];
  return storeCache[scope] = new BaseStore(url, options);
};
