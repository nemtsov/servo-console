var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  DeployStore = require('_/stores/deploy'),
  ConfigStore = require('_/stores/config'),
  BuildStore = require('_/stores/build'),
  Router = require('react-router'),
  Comparison = require('./Comparison');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams(),
      appParams = {org: params.org, app: params.app, region: params.region},
      regionParams = {org: params.org, region: params.region},
      selectedBuild = (window.location.hash) ? window.location.hash.substr(1) : null;
    return {
      stackConfigs: new ConfigStore(params).register(this, 'stackConfigs'),
      appConfigs: new ConfigStore(appParams).register(this, 'appConfigs'),
      regionConfigs: new ConfigStore(regionParams).register(this, 'regionConfigs'),
      deploys: new DeployStore(params).register(this, 'deploys'),
      builds: new BuildStore(params).register(this, 'builds'),
      selectedBuild: selectedBuild,
      buildSearch: selectedBuild,
      description: null,
      error: null
    };
  },

  render: function () {
    var params = this.getParams(),
      completeDeploys = this.state.deploys.data.filter(function (deploy) {
        return (deploy.state === 'COMPLETE');
      }),
      currentDeploy = completeDeploys[0] || null,
      currentBuildId = (currentDeploy) ? currentDeploy.buildId : null,
      currentBuild = (currentBuildId) ? this.state.builds.get(currentBuildId) : null,
      search = this.state.buildSearch,
      builds = this.state.builds.data.filter(function (build) {
        if (build.state !== 'COMPLETE') return false;
        if (build.id === currentBuildId) return false;
        if (!search) return true;
        var regex = new RegExp(search, 'i');
        if (build.commit.message && regex.test(build.commit.message)) return true;
        if (build.commit.author && build.commit.author.name && regex.test(build.commit.author.name)) return true;
        if (build.commit.commit && regex.test(build.commit.commit.message)) return true;
        if (build.commit.commit && regex.test(build.commit.commit.author.name)) return true;
        if (regex.test(build.id)) return true;
        return false;
      }).slice(0, (currentBuild) ? 3 : 4),
      config = (this.state.stackConfigs.loaded && this.state.appConfigs.loaded && this.state.regionConfigs.loaded) ?
        this.computeConfig() : null,
      deployStub = (config) ? this.createDeployStub(config) : null;

    return (
      <div className="NewDeploy">
        <Header />
        <Boot.Grid>
          <div className="Title">
            <h1>New Deploy</h1>
          </div>
          <Boot.Row>
            <Boot.Col md={8}>
              <Boot.Panel header="Step 1: Select a Build" bsStyle={(this.state.selectedBuild) ? 'default' : 'primary'}>
                <Boot.Input type='text' placeholder='Search by commit message or author'
                            onChange={this.searchChange} value={search} groupClassName="search"/>
                <Boot.Table hover>
                  <tbody>
                  {(currentBuild) ? this.buildItem(currentBuild, true) : null}
                  {builds.map(this.buildItem)}
                  {(this.state.builds.loaded && !builds.length) ?
                    <div className="text-center noBuilds">
                      Looks like you don't have any builds available yet<br />
                      <Router.Link to="builds" params={params}>
                        <Boot.Button bsStyle="success">Get Started with Builds!</Boot.Button>
                      </Router.Link>
                    </div>
                    :null}
                  </tbody>
                </Boot.Table>
              </Boot.Panel>
            </Boot.Col>
            <Boot.Col md={4}>
              <Boot.Panel header="Step 2: Review Changes and Deploy"
                          bsStyle={(this.state.selectedBuild) ? 'primary' : 'default'}>
                {(this.state.selectedBuild) ?
                  <div className="text-center">
                    <p>Review the change summary below and click deploy when ready.</p>
                    <Boot.Input type='textarea' placeholder='Deploy description (optional)'
                      onChange={this.descriptionChange} value={this.state.description} />
                    <Boot.Button bsStyle="success" onClick={this.startDeploy}>Deploy Now!</Boot.Button>
                  </div> : <div className="text-center">Select a build first...</div>
                }
                {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error}</Boot.Alert> : null}
              </Boot.Panel>
            </Boot.Col>
          </Boot.Row>

          {(this.state.selectedBuild && deployStub) ? <Comparison older={currentDeploy} newer={deployStub} /> : null}
        </Boot.Grid>
        <Footer />
      </div>
    );
  },

  searchChange: function (event) {
    this.setState({buildSearch: event.target.value});
  },

  descriptionChange: function (event) {
    this.setState({description: event.target.value});
  },

  buildItem: function (build, current) {
    var className = (this.state.selectedBuild === build.id) ? 'selected buildItem' : 'buildItem';
    return <tr key={build.id} className={className} onClick={this.selectBuild.bind(this, build.id)}>
      <td>{build.commit.sha.substr(0, 8)}</td>
      <td>{(build.commit.commit) ? build.commit.commit.author.name : build.commit.author.name}</td>
      <td>
        {(current === true) ? <span><Boot.Label bsStyle="primary">current</Boot.Label> </span> : null}
        {build.commit.message || build.commit.commit.message}
      </td>
    </tr>
  },

  selectBuild: function (buildId) {
    this.setState({selectedBuild: buildId});
  },

  computeConfig: function () {
    var config = this.state.stackConfigs.data.slice();
    this.state.appConfigs.data.forEach(function (appConfig) {
      var existing = config.filter(function (existingConfig) {
        return (existingConfig.key === appConfig.key);
      })[0];
      if (!existing) config.push(appConfig);
    });
    this.state.regionConfigs.data.forEach(function (regionConfig) {
      var existing = config.filter(function (existingConfig) {
        return (existingConfig.key === regionConfig.key);
      })[0];
      if (!existing) config.push(regionConfig);
    });
    return config;
  },

  createDeployStub: function (config) {
    return {
      buildId: this.state.selectedBuild,
      config: config
    }
  },

  startDeploy: function () {
    var self = this,
      params = this.getParams(),
      payload = {buildId: this.state.selectedBuild};
    if (this.state.description) payload.description = this.state.description;
    this.state.deploys.post(payload, function (err) {
      if (err) return self.setState({error: err.message});
      self.transitionTo('stack', params);
    });
  }

});