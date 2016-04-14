var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  ConfigStore = require('_/stores/config'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams();
    return {
      configs: new ConfigStore(params).register(this, 'configs'),
      registry: 'https://index.docker.io/v1/',
      user: null,
      password: null,
      error: null
    };
  },

  render: function () {
    var configs = this.state.configs.data.filter(function (item) {
        return (item.key === 'DockerRegistryAuth')
      }),
      config = configs[0] || null,
      loaded = this.state.configs.loaded,
      error = this.state.error;
    return (
      <div className="DockerPage">
        <Header />
        {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error.message}</Boot.Alert> : null}
        <Boot.Grid>
          <div className="Title">
            <h1>Docker Registry Configuration</h1>
          </div>
          <Boot.Well>
            If you're deploying Docker-based applications on Servo, your Dockerfile may reference an image stored
            in a private Docker registry. In this case, you can configure how to authenticate to your private
            registry below. If your Dockerfile <i>FROM</i> statement references a publicly available image from
            Docker Hub, you don't have to configure anything. Changes made here apply immediately to all new builds
            within this app.
          </Boot.Well>
          {(error) ? <Boot.Alert bsStyle="danger">{error.message || error}</Boot.Alert> : null}
          {(loaded) ? <Boot.Col md={6}>
            <h3>Registry Authentication {(config) ?
              <Boot.Label bsStyle="success">configured</Boot.Label> :
              <Boot.Label bsStyle="warning">not configured</Boot.Label>}
            </h3>
            {(config) ? <div>
              <Boot.Alert bsStyle="warning">
                The values are encrypted and cannot be retrieved or directly modified. If you want
                to change the values, you can clear the current settings below and then enter new credentials after.
              </Boot.Alert>
              <p><Boot.Button bsStyle="danger" onClick={this.clear}>Clear Current Settings</Boot.Button></p>
            </div> : null}
            </Boot.Col> : <div>Loading...</div>}
          {(!config && loaded) ? <Boot.Col md={6}>
            <Boot.Input type='text' label='Registry Base URL'
                        value={this.state.registry} onChange={this.handleRegistryChange} />
            <Boot.Input type='text' label='Username'
                        value={this.state.user} onChange={this.handleUserChange} />
            <Boot.Input type='password' label='Password'
                        value={this.state.password} onChange={this.handlePasswordChange} />
            <Boot.Button bsStyle="success" onClick={this.save}>Save Settings</Boot.Button>
          </Boot.Col> : null}
        </Boot.Grid>
        <Footer />
      </div>
    );
  },

  handleRegistryChange: function (event) {
    this.setState({registry: event.target.value});
  },

  handleUserChange: function (event) {
    this.setState({user: event.target.value});
  },

  handlePasswordChange: function (event) {
    this.setState({password: event.target.value});
  },

  save: function () {
    var self = this;
    this.setState({error: null});
    this.state.configs.post({
      key: 'DockerRegistryAuth',
      value: this.state.user + ':' + this.state.password + '@' + this.state.registry,
      secret: true
    }, function (err) {
      if (err) self.setState({error: error});
    });
  },

  clear: function () {
    var id = this.state.configs.data.filter(function (item) {
      return (item.key === 'DockerRegistryAuth')
    })[0].id;
    this.state.configs.del(id, function (err) {
      if (err) self.setState({error: error});
    })
  }
});
