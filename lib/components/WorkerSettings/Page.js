var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  SettingInput = require('./SettingInput'),
  WorkerSelect = require('./WorkerSelect'),
  Summary = require('./Summary'),
  instanceTypes = require('_/constants/InstanceTypes'),
  Boot = require('react-bootstrap'),
  DeployStore = require('_/stores/deploy'),
  ConfigStore = require('_/stores/config'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams(),
      appParams = {org: params.org, app: params.app, region: params.region},
      regionParams = {org: params.org, region: params.region};
    return {
      stackConfigs: new ConfigStore(params).register(this, 'stackConfigs'),
      appConfigs: new ConfigStore(appParams).register(this, 'appConfigs'),
      regionConfigs: new ConfigStore(regionParams).register(this, 'regionConfigs'),
      deploys: new DeployStore(params).register(this, 'deploys'),
      newInstanceType: null
    };
  },

  settingsKeys: ['MaxWorkers', 'MinWorkers', 'ScaleUpThreshold', 'ScaleDownThreshold',
    'ScaleUpDuration', 'ScaleDownDuration', 'InstanceType'],

  render: function () {
    var currentSettings = this.currentSettings(),
      defaultSettings = this.defaultSettings(),
      deployedSettings = this.deployedSettings();
    return (
      <div className="WorkerSettings">
        <Header />
        <Boot.Grid>
          <div className="Title">
            <h1>Worker Settings</h1>
            <StoreStatus store={this.state.stackConfigs} />
          </div>
          <Boot.Well>
            Here you can configure what resources your workers are provisioned with in
            addition to how your workers scale. Servo has a default configuration
            that is optimized for common application workloads, but you can
            tune your workers to meet your application's performance needs.
            Changes made here are applied to your stack on deployment.
          </Boot.Well>
          <Boot.Row>
            <Boot.Col md={7}>
              <WorkerSelect store={this.state.stackConfigs} current={currentSettings}
                            defaults={defaultSettings} deployed={deployedSettings}/>
              <SettingInput store={this.state.stackConfigs} current={currentSettings}
                            defaults={defaultSettings} deployed={deployedSettings}
                            settingKey="MinWorkers" description="Minimum Worker Count"/>
              <hr />
              <SettingInput store={this.state.stackConfigs} current={currentSettings}
                            defaults={defaultSettings} deployed={deployedSettings}
                            settingKey="MaxWorkers" description="Maximum Worker Count"/>
              <hr />
              <SettingInput store={this.state.stackConfigs} current={currentSettings}
                            defaults={defaultSettings} deployed={deployedSettings}
                            settingKey="ScaleUpThreshold" description="Scale Up CPU Threshold (percent)"/>
              <hr />
              <SettingInput store={this.state.stackConfigs} current={currentSettings}
                            defaults={defaultSettings} deployed={deployedSettings}
                            settingKey="ScaleUpDuration" description="Scale Up High CPU Duration (minutes)"/>
              <hr />

              <SettingInput store={this.state.stackConfigs} current={currentSettings}
                            defaults={defaultSettings} deployed={deployedSettings}
                            settingKey="ScaleDownThreshold" description="Scale Down CPU Threshold (percent)"/>
              <hr />
              <SettingInput store={this.state.stackConfigs} current={currentSettings}
                            defaults={defaultSettings} deployed={deployedSettings}
                            settingKey="ScaleDownDuration" description="Scale Down Low CPU Duration (minutes)"/>
            </Boot.Col>
            <Boot.Col md={5}>
              <Summary settings={currentSettings} defaults={defaultSettings}/>
            </Boot.Col>
          </Boot.Row>
        </Boot.Grid>
        <Footer />
      </div>
    );
  },

  currentSettings: function () {
    var settings = {},
      self = this;
    this.settingsKeys.forEach(function (key) {
      if (!self.state.stackConfigs.loaded) return settings[key] = null;
      settings[key] = filterKeys(self.state.stackConfigs.data, key).value || 'default'
    });
    return settings;
  },

  defaultSettings: function () {
    var settings = {},
      self = this;
    this.settingsKeys.forEach(function (key) {
      var appSetting = filterKeys(self.state.appConfigs.data, key),
        regionSetting = filterKeys(self.state.regionConfigs.data, key);
      if (appSetting.value) settings[key] = appSetting.value;
      else if (regionSetting.value) settings[key] = regionSetting.value;
      else settings[key] = null;
    });
    return settings;
  },

  deployedSettings: function () {
    var self = this,
      settings = {},
      recentDeploy = this.state.deploys.data.filter(function (deploy) {
        return (deploy.state === 'COMPLETE');
      })[0];
    this.settingsKeys.forEach(function (key) {
      if (!recentDeploy) return settings[key] = null;
      recentDeploy.config.forEach(function (config) {
        if (config.key === key) settings[key] = config.value;
      });
      if (!settings[key]) settings[key] = null;
    });
    return settings;
  }
});

function filterKeys(configs, key) {
  return configs.filter(function (config) {
    return (config.key === key)
  })[0] || {};
}