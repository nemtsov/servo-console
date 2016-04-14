var BaseStore = require('./base'),
  regions = require('_/constants/regions');

module.exports = function (params, source, query) {
  var url = regions[params.region].endpoint + '/orgs/' + params.org + '/apps/' + params.app + '/stacks/' +
      params.stack + '/logs/' + source;
  return new BaseStore(url, {query: query, refresh: 3, max: 1000, order: 'asc'});
};