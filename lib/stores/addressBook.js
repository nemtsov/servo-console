var BaseStore = require('./base'),
  regions = require('_/constants/regions'),
  storeCache = {};

module.exports = function (params) {
  var scope = params.org + ':' + params.region,
    url = regions[params.region].endpoint + '/orgs/' + params.org + '/admin/addressBooks';
  if (storeCache[scope]) return storeCache[scope];
  return storeCache[scope] = new BaseStore(url, {objectKey: 'id', total: true});
};
