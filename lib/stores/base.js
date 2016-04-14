var request = require('./request'),
  events = require('events');

module.exports = BaseStore;

function BaseStore(path, options) {
  if (!options) options = {};
  this._refresh = (options.refresh === undefined) ? 15 : options.refresh;
  this._total = options.total || false;
  this._objectKey = options.objectKey || 'id';
  this._query = options.query || {};
  this._max = options.max || 1000;
  this._order = options.order || 'desc';
  this._path = path;
  this._inFlight = [];
  this._emitter = new events.EventEmitter();
  this._index = {};
  this.data = [];
  this.loading = false;
  this.loaded = false;
  this.refreshed = null;
  this.error = null;
  this.more = null;
  initialLoad.call(this);
  if (this._refresh) this._refreshInterval = setInterval(refresh.bind(this), this._refresh * 1000);
}

BaseStore.prototype.get = function (key, cb) {
  var self = this,
    path = this._path;

  if (key) {
    path = path + '/' + key;
    var found = this.data.filter(function (item) {
      return (item[self._objectKey] === key);
    })[0];
    if (found) return found;
  }

  if (this._inFlight.indexOf(path) === -1) this._inFlight.push(path); else return;
  request.get(path, {query: this._query}, function(err, res, data) {
    if (err && cb) return cb(err);
    processResponse.call(self, path, err, res, data);
    if (cb) cb(null, data);
  });
  return null;
};

BaseStore.prototype.post = function (obj, cb) {
  var self = this;
  request.post(this._path, obj, function (err, res, data) {
    if (err) return cb(err);
    processData.call(self, data);
    if (self._emitter) self._emitter.emit('change');
    cb(null, data);
  });
};

BaseStore.prototype.put = function (key, obj, cb) {
  var self = this;
  request.put(this._path + '/' + key, obj, function (err, res, data) {
    if (err) return cb(err);
    processData.call(self, data);
    if (self._emitter) self._emitter.emit('change');
    cb(null, data);
  });
};

BaseStore.prototype.del = function (key, cb) {
  var self = this;
  request.del(this._path + '/' + key, function(err) {
    if (err) return cb(err);
    delete self._index[key];
    self.data = self.data.filter(function (value) {
      return value[self._objectKey] !== key;
    });
    cb();
    if (self._emitter) self._emitter.emit('change');
  });
};

BaseStore.prototype.more = function () {
  if (!this.more) return;
  var path = this._path + '?createdBefore=' + this.more;
  this.loading = true;
  if (this._emitter) this._emitter.emit('change');
  if (this._inFlight.indexOf(path) === -1) this._inFlight.push(path); else return;
  request.get(path, {query: this._query}, processResponse.bind(this, path));
};

BaseStore.prototype.addListener = function (callback) {
  this._emitter.addListener('change', callback);
};

BaseStore.prototype.removeListener = function (callback) {
  this._emitter.removeListener('change', callback);
};

BaseStore.prototype.register = function (component, name) {
  var store = this;
  function changeHandler() {
    if (!component.isMounted()) {
      return store.deregister();
    }
    var state = {};
    state[name] = store;
    component.setState(state);
  }
  store._emitter.addListener('change', changeHandler);
  store.changeHandler = changeHandler;
  return store;
};

BaseStore.prototype.deregister = function () {
  this._emitter.removeListener('change', this.changeHandler);
};

BaseStore.prototype.close = function () {
  clearInterval(this._refreshInterval);
  this.data = [];
  this._emitter.emit('change');
  delete this._emitter;
};

BaseStore.prototype.pauseRefresh = function () {
  if (!this._refreshInterval) return;
  clearInterval(this._refreshInterval);
  delete this._refreshInterval;
};

BaseStore.prototype.resumeRefresh = function () {
  if (this._refreshInterval) {
    refresh.call(this);
    this._refreshInterval = setInterval(refresh.bind(this), this._refresh * 1000);
  }
};

BaseStore.prototype.refresh = refresh;

function initialLoad() {
  var path = this._path;
  this.loading = true;
  if (this._emitter) this._emitter.emit('change');
  if (this._inFlight.indexOf(path) === -1) this._inFlight.push(path); else return;
  request.get(path, {query: this._query}, processResponse.bind(this, path));
}

function refresh() {
  var self = this,
    path = this._path,
    lastUpdated = 0;
  if (!this._emitter.listeners('change').length) return;
  if (this._inFlight.indexOf(path) === -1) this._inFlight.push(path); else return;
  this.loading = true;
  Object.keys(this._index).forEach(function (key) {
    if (self._index[key] > lastUpdated) lastUpdated = self._index[key];
  });
  if (this._emitter) this._emitter.emit('change');
  (lastUpdated) ? lastUpdated++ : lastUpdated = new Date(new Date().getTime() - 60000).getTime();
  path = this._path + '?destroyed=true&updatedAfter=' + lastUpdated;
  request.get(path, {query: this._query}, processResponse.bind(this, path));
}

function processResponse(path, err, res, data) {
  var self = this;
  this._inFlight.splice(this._inFlight.indexOf(path), 1);
  self.loading = (this._inFlight.length);
  self.error = err;
  if (res) self.more = res.getResponseHeader('Next');
  if (!err) {
    self.refreshed = new Date();
    self.loaded = true;
  }
  if (data) processData.call(this, data);
  if (this._emitter) this._emitter.emit('change');
  if (this._total && self.more) this.more();
}

function processData(data, dropNewest) {
  var self = this,
    key = self._objectKey,
    desc = (this._order === 'desc');

  if (!Array.isArray(data)) data = [data];

  data.forEach(function (obj) {

    if (obj._destroyed) { //deleted object
      self._index[obj[key]] = obj._updatedAt || obj._createdAt || new Date().valueOf();
      return self.data.forEach(function (existingObj, index, data) {
        if (existingObj[key] === obj[key]) data.splice(index, 1);
      });
    }

    if (!self._index[obj[key]]) { //new object

      if (self.data.length >= self._max) {
        var purged;
        if (desc)
          purged = (dropNewest) ? self.data.shift() : self.data.pop();
        else
          purged = (dropNewest) ? self.data.pop() : self.data.shift();
        delete self._index[purged[key]];
      }

      if (desc)
        (dropNewest) ? self.data.push(obj) : self.data.unshift(obj);
      else
        (dropNewest) ? self.data.unshift(obj) : self.data.push(obj);
    } else { //updated object
      self.data.forEach(function (existingObj, index, data) {
        if (existingObj[key] === obj[key]) data[index] = obj;
      });
    }
    self._index[obj[key]] = obj._updatedAt || obj._createdAt || new Date().valueOf();
  });
  if (desc) this.data.sort(sortDescending);
  else this.data.sort(sortAscending);
}

function sortAscending(a, b) {
  if (a._createdAt > b._createdAt) return 1;
  if (a._createdAt < b._createdAt) return -1;
  if (a.id < b.id) return 1;
  if (a.id > b.id) return -1;
  return 0;
}

function sortDescending(a, b) {
  if (a._createdAt < b._createdAt) return 1;
  if (a._createdAt > b._createdAt) return -1;
  if (a.id > b.id) return 1;
  if (a.id < b.id) return -1;
  return 0;
}
