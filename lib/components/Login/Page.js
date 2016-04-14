var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  MfaSetup = require('./MfaSetup'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  regions = require('_/constants/regions'),
  request = require('_/stores/request');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    return {
      username: null,
      password: null,
      mfa: null,
      error: null,
      tempToken: null,
      mfaUsername: null
    };
  },

  render: function () {
    var error = this.state.error,
      query = this.getQuery(),
      regionName = query && query.region || Object.keys(regions)[0],
      token = localStorage.getItem('token');
    if (token) return window.location.assign('/');
    return (
      <div className="LoginPage">
        <Header />
        <Boot.Row>
          <Boot.Col xs={12} md={4} mdOffset={4}>
            <Boot.Panel header='Servo Login' bsStyle="primary">
              {(error) ? <Boot.Alert bsStyle="danger">{error.message || error}</Boot.Alert> : null}
              <Boot.Input type='email' value={this.state.username} label='Email Address'
                          onKeyDown={this.handleKeyDown} onChange={this.handleUsernameChange} />
              <Boot.Input type='password' value={this.state.password} label='Password'
                          onKeyDown={this.handleKeyDown} onChange={this.handlePasswordChange} />
              {(this.state.tempToken) ?
                <MfaSetup token={this.state.tempToken} region={regionName} done={this.closeMfa}
                          username={this.state.mfaUsername}/>
                : <Boot.Input type='text' value={this.state.mfa} label='MFA Token'
                          onKeyDown={this.handleKeyDown} onChange={this.handleMfaChange} />}
              {(!this.state.tempToken) ?
                <div className="text-center">
                  <Boot.Button bsStyle="primary" onClick={this.login}>Login</Boot.Button>
                </div> : null}
            </Boot.Panel>
          </Boot.Col>
        </Boot.Row>
        <Footer />
      </div>
    );
  },

  login: function () {
    var self = this,
      query = this.getQuery(),
      regionName = query && query.region || Object.keys(regions)[0],
      region = regions[regionName],
      url = region.endpoint + '/users/me/sessions',
      payload = {
        username: this.state.username.toLowerCase(),
        password: this.state.password,
        mfa: this.state.mfa
      };
    this.setState({error: null});
    request.post(url, payload, function (err, res, data) {
      if (err) return self.setState({error: err});
      if (!data.mfa && data.token) {
        return self.setState({tempToken: data.token, mfaUsername: data.username});
      }
      localStorage.setItem('username', data.username);
      localStorage.setItem('name', data.name);
      localStorage.setItem('token', data.token);
      self.transitionTo(query.callback || 'map');
    });
  },

  closeMfa: function () {
    this.setState({tempToken: null});
  },

  handleKeyDown: function (event) {
    if (event.keyCode === 13) {
      event.stopPropagation();
      this.login();
    }
  },

  handleUsernameChange: function (event) {
    this.setState({username: event.target.value});
  },

  handlePasswordChange: function (event) {
    this.setState({password: event.target.value});
  },

  handleMfaChange: function (event) {
    this.setState({mfa: event.target.value});
  }
});
