var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  DeployStore = require('_/stores/deploy'),
  ConfigStore = require('_/stores/config'),
  EnvironmentVariableItem = require('_/components/EnvironmentVariables/Item'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams();
    return {
      configs: new ConfigStore(params).register(this, 'configs'),
      deploys: new DeployStore(params).register(this, 'deploys'),
      newKey: '', newValue: '', newSecret: false
    };
  },

  render: function () {
    var configStore = this.state.configs,
      recentDeploy = this.state.deploys.data.filter(function (deploy) {
        return (deploy.state === 'COMPLETE');
      })[0],
      envVariables = this.state.configs.data.filter(function (config) {
        return (/^env\./.test(config.key));
      }).sort(function (a, b) {
        if (a.key < b.key) return -1;
        if (a.key > b.key) return 1;
        return 0;
      });
    if (recentDeploy) {
      envVariables.forEach(function (envVariable) {
        var current = recentDeploy.config.filter(function (item) {
          return (item.key === envVariable.key && item.value === envVariable.value);
        });
        envVariable.deployed = (current.length) ? true : false;
      });
    }
    return (
      <div className="EnvironmentVariables">
        <Header />
        <Boot.Grid>
          <div className="Title">
            <h1>Environment Variables</h1>
            <StoreStatus store={configStore} />
          </div>
          <Boot.Well>
            Environment variables are a great way to publish configuration to your
            application that changes from stack to stack. You can set environment variables
            here that will be set when your application is deployed and running. Changes to
            environment variables are applied on deployment.
          </Boot.Well>
          <Boot.Panel className="form-inline createForm">
            <h4>New Environment Variable</h4>
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name"
                   placeholder="LOG_LEVEL" value={this.state.newKey}
                   onChange={this.handleNewKeyChange} onKeyDown={this.handleNewKeyDown}/>
            <label htmlFor="name">Value</label>
            <input type="text" className="form-control" id="name"
                   placeholder="verbose" value={this.state.newValue}
                   onChange={this.handleNewValueChange} onKeyDown={this.handleNewKeyDown}/>
            <label>
              <input type="checkbox" checked={this.state.newSecret}
                     onChange={this.handleNewSecretChange}/> <i className="fa fa-user-secret"></i> Secret
            </label>
            <Boot.Button bsStyle="success" onClick={this.saveNewConfig}>Save</Boot.Button>
            {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error}</Boot.Alert> : null}
          </Boot.Panel>
          <Boot.Table>
            <thead>
              <tr>
                <th>Variable Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
            {envVariables.map(function (envVariable) {
              return <EnvironmentVariableItem key={envVariable.id} store={configStore} item={envVariable}/>
            })}
            {(!envVariables.length) ? <tr><td>Add some above...</td></tr> : null}
            </tbody>
          </Boot.Table>
        </Boot.Grid>
        <Footer />
      </div>
    );
  },

  handleNewKeyChange: function (event) {
    this.setState({newKey: event.target.value});
  },

  handleNewValueChange: function (event) {
    this.setState({newValue: event.target.value});
  },

  handleNewSecretChange: function (event) {
    this.setState({newSecret: event.target.checked});
  },

  handleNewKeyDown: function (event) {
    var enterKey = 13;
    if (event.keyCode === enterKey) this.saveNewConfig();
  },

  saveNewConfig: function () {
    var self = this,
      newConfig = {
        key: 'env.' + this.state.newKey,
        value: this.state.newValue,
        secret: this.state.newSecret
      };
    this.state.configs.post(newConfig, function (err) {
      if (err) return self.setState({error: err.message})
      self.setState({error: null, newKey: '', newValue: '', newSecret: false})
    });
  }
});
