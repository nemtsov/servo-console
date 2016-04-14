var request = require('browser-request');

exports.get = function (path, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  if (!options.query) options.query = {};
  request({
    method: 'GET',
    uri: path,
    json: true,
    timeout: 10000,
    qs: options.query,
    headers: {token: localStorage.getItem('token')}
  }, responseHandler.bind({}, cb))
};

exports.post = function (path, obj, cb) {
  request({
    method: 'POST',
    uri: path,
    body: obj,
    json: true,
    timeout: 10000,
    headers: {token: localStorage.getItem('token')}
  }, responseHandler.bind({}, cb))
};

exports.put = function (path, obj, cb) {
  request({
    method: 'PUT',
    uri: path,
    body: obj,
    json: true,
    timeout: 10000,
    headers: {token: localStorage.getItem('token')}
  }, responseHandler.bind({}, cb))
};

//had to set json to false for config delete request
exports.del = function (path, cb) {
  request({
    method: 'DELETE',
    uri: path,
    json: false,
    timeout: 10000,
    headers: {token: localStorage.getItem('token')}
  }, responseHandler.bind({}, cb))
};

function responseHandler(cb, err, res, body) {
  try {
    body = JSON.parse(body);
  } catch (err) {
    //noop
  }
  if (res && res.status === 401 && window.location.pathname !== '/login') {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    // return window.location.assign('/login');
  }
  if (err && err.name === 'SyntaxError') {
    if (!res.body) return cb(null);
    return cb(new Error(res.body));
  }
  if (err) return cb(err);
  if (res.status >= 400) return cb(new Error(res.status + ' : ' + body.error));
  cb(null, res, body);
}
