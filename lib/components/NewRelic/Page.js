var React = require('react'),
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  DeployStore = require('_/stores/deploy'),
  ConfigStore = require('_/stores/config'),
  Router = require('react-router'),
  async = require('async');

function configArrayToObj (configArray) {
  var configObj = {};
  configArray.forEach(function (config) {
    configObj[config.key] = config;
  });
  return configObj;
}

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams();

    return {
      editing: false,
      saving: false,
      accountId: '',
      licenseKey: '',
      apiKey: '',
      regionConfig: new ConfigStore({region: params.region, org: params.org}).register(this, 'regionConfig'),
      stackConfig: new ConfigStore(params).register(this, 'stackConfig')
    };
  },

  getNewRelicConfig: function () {
    var state = this.state;

    var config = configArrayToObj(state.stackConfig.data);

    if (config.NewRelicAccountId) return config;

    config = configArrayToObj(state.regionConfig.data);

    return config;
  },

  toggleEditingState: function () {
    this.setState({
      editing: !this.state.editing,
      accountId: '',
      licenseKey: '',
      apiKey: ''
    });
  },

  updateValue: function (key, event) {
    var newState = {};
    newState[key] = event.target.value;
    this.setState(newState);
  },

  render: function () {    
    var newrelicConfig = this.getNewRelicConfig(),
      notConfigured = !newrelicConfig.NewRelicAccountId,
      accountURL = '',
      usingDefault = false;

    if (!notConfigured) {
      accountURL = 'https://rpm.newrelic.com/accounts/' + newrelicConfig.NewRelicAccountId.value + '/applications',
      usingDefault = /global/.test(newrelicConfig.NewRelicAccountId.level);
    }

    return (
      <div>
        <Header />
        <Boot.Grid>
          <div className="Title">
            <h1>NewRelic Configuration</h1>
            <StoreStatus store={this.state.stackConfig} />
          </div>
          <Boot.Well>
            NewRelic helps you understand the performance of your app. If you want to 
            change the NewRelic account your app reports to, you have to provide servo
            with your new relic account Id, license key and api key.
          </Boot.Well>
          <Boot.Panel>
            {
            this.state.editing || notConfigured? 
            <Boot.Row>
              <Boot.Col md={9}>
                <Boot.Row className="form-group NewRelic-Input-First-Row">
                  <Boot.Col md={2}>
                    <label className="NewRelic-Label" htmlFor="accountId">Account Id</label>
                  </Boot.Col>
                  <Boot.Col md={6}>
                    <input type="text" className="form-control" id="accountId"
                      placeholder="Account Id" value={this.state.accountId}
                      onChange={this.updateValue.bind(this, 'accountId')}/>
                  </Boot.Col>
                  <Boot.Col md={4}/>
                </Boot.Row>
                <Boot.Row className="form-group">
                  <Boot.Col md={2}>
                    <label className="NewRelic-Label" htmlFor="licenseKey">License Key</label>
                  </Boot.Col>
                  <Boot.Col md={6}>
                    <input type="text" className="form-control" id="licenseKey"
                      placeholder="License Key" value={this.state.licenseKey}
                      onChange={this.updateValue.bind(this, 'licenseKey')}/>
                  </Boot.Col>
                  <Boot.Col md={4}/>
                </Boot.Row>  
                <Boot.Row className="form-group">
                  <Boot.Col md={2}>
                    <label className="NewRelic-Label" htmlFor="apiKey">API Key</label>
                  </Boot.Col>
                  <Boot.Col md={6}>
                    <input type="text" className="form-control" id="apiKey"
                      placeholder="API Key" value={this.state.apiKey}
                      onChange={this.updateValue.bind(this, 'apiKey')}/>
                  </Boot.Col>
                  <Boot.Col md={4}/>
                </Boot.Row>
                <Boot.Row>
                  <Boot.Col md={2} sm={4} xs={6}>
                    {notConfigured ? null : 
                      <Boot.Button bsStyle="danger" onClick={this.toggleEditingState} disabled={this.state.saving}>
                        <Boot.Glyphicon glyph="remove-circle"/> Cancel
                      </Boot.Button>                        
                    }                 
                  </Boot.Col>
                  <Boot.Col md={2} sm={4} xs={6}>
                    <Boot.Button bsStyle="success" onClick={this.saveNewConfig} disabled={this.state.saving}>
                      <Boot.Glyphicon glyph="ok-circle"/> Save
                    </Boot.Button>
                  </Boot.Col>
                  <Boot.Col md={8} sm={4} xs={0}/>
                </Boot.Row>                    
              </Boot.Col>
              <Boot.Col md={3}/>
            </Boot.Row>
            : 
            <Boot.Row>
              <Boot.Col md={12}>
                <Boot.Row>
                  <Boot.Col md={4}>
                    <h4>
                      <a href={accountURL}>Account: {newrelicConfig.NewRelicAccountId.value}</a>
                    </h4>
                  </Boot.Col>
                  <Boot.Col md={8}/>
                </Boot.Row>
                <Boot.Row>
                  <Boot.Col md={6}>
                    <h4>
                      License Key: {newrelicConfig.NewRelicLicenseKey.value}
                    </h4>
                  </Boot.Col>
                  <Boot.Col md={6}/>
                </Boot.Row>
                <Boot.Row className="NewRelic-Button-Row">
                  <Boot.Col md={1}>
                    <Boot.Button bsStyle="primary" onClick={this.toggleEditingState} disabled={this.state.saving}>
                      <Boot.Glyphicon glyph="cog"/> Config
                    </Boot.Button>  
                  </Boot.Col>
                  <Boot.Col md={4}>
                    {
                      usingDefault ? null : 
                      <Boot.Button bsStyle="danger" onClick={this.revertToDefaultConfig} disabled={this.state.saving}>
                        <Boot.Glyphicon glyph="repeat"/> Back to Default
                      </Boot.Button> 
                    }
                  </Boot.Col>
                  <Boot.Col md={7}/>
                </Boot.Row>
              </Boot.Col>
            </Boot.Row>
            }
          </Boot.Panel>
          {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error}</Boot.Alert> : null}
        </Boot.Grid>
        <Footer />
      </div>
    );
  },

  revertToDefaultConfig: function () {
    var self = this,
      currentConfig = this.getNewRelicConfig(this.state);

    this.setState({saving: true});

    async.auto({
      accountId: function (done) {
        if (currentConfig.NewRelicAccountId.level.match('global')) return done();
        self.state.stackConfig.del(currentConfig.NewRelicAccountId.id, done);
      },
      licenseKey: function (done) {
        if (currentConfig.NewRelicLicenseKey.level.match('global')) return done();
        self.state.stackConfig.del(currentConfig.NewRelicLicenseKey.id, done);
      },
      apiKey: function (done) {
        if (currentConfig.NewRelicApiKey.level.match('global')) return done();
        self.state.stackConfig.del(currentConfig.NewRelicApiKey.id, done);
      }      
    }, function (err) {
      self.setState({saving: false});
      if (err) return self.setState({error: err.message});
    });
  },

  saveNewConfig: function () {
    var self = this,
      licenseKey = this.state.licenseKey,
      apiKey = this.state.apiKey,
      accountId = this.state.accountId,
      currentConfig = this.getNewRelicConfig(this.state);

    if (licenseKey.length !== 40) return this.setState({error: 'New Relic License key should be a 40-character hexadecimal string'});
    if (apiKey.length === 0) return this.setState({error: 'New Relic API key is required'});
    if (accountId.length === 0) return this.setState({error: 'New Relic Account Id is required'});

    this.setState({saving: true});

    async.auto({
      accountId: function (done) {
        if (currentConfig.NewRelicAccountId.value.match(accountId)) return done();
        var config = {
          key: 'NewRelicAccountId',
          value: accountId,
          secret: false
        };
        if (currentConfig.NewRelicAccountId.level.match('global')) return self.state.stackConfig.post(config, done);
        self.state.stackConfig.put(currentConfig.NewRelicAccountId.id ,config, done);
      },
      licenseKey: function (done) {
        if (currentConfig.NewRelicLicenseKey.value.match(accountId)) return done();
        var config = {
          key: 'NewRelicLicenseKey',
          value: licenseKey,
          secret: false
        };
        if (currentConfig.NewRelicLicenseKey.level.match('global')) return self.state.stackConfig.post(config, done);
        self.state.stackConfig.put(currentConfig.NewRelicLicenseKey.id ,config, done);
      },
      apiKey: function (done) {
        if (currentConfig.NewRelicApiKey.value.match(accountId)) return done();
        var config = {
          key: 'NewRelicApiKey',
          value: apiKey,
          secret: true
        };
        if (currentConfig.NewRelicApiKey.level.match('global')) return self.state.stackConfig.post(config, done);
        self.state.stackConfig.del(currentConfig.NewRelicApiKey.id, function (err) {
          if (err) return done(err);
          self.stackConfig.post(config, done);
        });
      } 
    }, function (err, results) {
      self.setState({saving: false});
      if (err) return self.setState({error: err.message});
      self.toggleEditingState();
    });
  }
});
