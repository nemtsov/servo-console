var React = require('react'),
  Link = require('react-router').Link,
  PopUp = require('_/components/Common/PopUp'),
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  AppStore = require('_/stores/app'),
  StackStore = require('_/stores/stack'),
  DeployStore = require('_/stores/deploy'),
  BuildStore = require('_/stores/build'),
  EventStore = require('_/stores/event'),
  DeployItem = require('_/components/Stack/DeployItem'),
  EventItem = require('_/components/Stack/EventItem'),
  CreateDeployModal = require('_/components/Stack/CreateDeployModal'),
  StackIcon = require('_/components/Icons/Stack'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams();
    return {
      apps: new AppStore(params).register(this, 'apps'),
      stacks: new StackStore(params).register(this, 'stacks'),
      deploys: new DeployStore(params).register(this, 'deploys'),
      builds: new BuildStore(params).register(this, 'builds'),
      events: new EventStore(params).register(this, 'events')
    };
  },

  deleteStack: function (){
    var stack = this.getParams().stack,
      self = this;

    this.state.stacks.del(stack, function (err) {
      if (err) return self.setState({error: err});
      self.transitionTo('app', self.getParams());
    });
  },

  render: function () {
    var params = this.getParams(),
      app = this.state.apps.get(params.app),
      stack = this.state.stacks.get(params.stack),
      gitUrl = (app) ? 'http://' + app.source : null,
      buildStore = this.state.builds,
      stackStore = this.state.stacks,
      appStore = this.state.apps,
      deployStore = this.state.deploys,
      assets = (stack && stack.assets) ?
        stack.assets.active || stack.assets.pending : {};

    return (
      <div className="StackPage">
        <Header />
        <Boot.Grid>
          <Boot.Row>
            <Boot.Col md={7}>
              <div className="Title">
                <h1><StackIcon size="32" /> {(stack) ? stack.name : 'Loading'}</h1>
              </div>

              <div className="options">
                <Link to="newDeploy" params={params}>
                  <Boot.Button bsStyle="success" onClick={this.deploy}>
                    <Boot.Glyphicon glyph="send"/> Deploy
                  </Boot.Button>
                </Link>
                <Boot.DropdownButton bsStyle="primary" title="Configure">
                  <li><Link to="stackEnvironmentVariables" params={params}>Environment Variables</Link></li>
                  <li><Link to="stackWorkerSettings" params={params}>Worker Settings</Link></li>
                  <li><Link to="stackNotifications" params={params}>Notifications</Link></li>
                  <li><Link to="stackNetworkAccess" params={params}>Network Access</Link></li>
                  <li><Link to="stackPermissions" params={params}>Permissions</Link></li>
                  <li><Link to="newrelic" params={params}>New Relic</Link></li>
                </Boot.DropdownButton>
                <Boot.DropdownButton bsStyle="primary" title="Monitor">
                  <li><Link to="logs" params={params}>Log Explorer</Link></li>
                  <Boot.MenuItem target="_blank" href={assets.newRelicLink} className={assets.newRelicLink ? '': "disabled"}>New Relic</Boot.MenuItem>
                  <li><Link to="workers" params={params}>Workers</Link></li>
                  <Boot.MenuItem className="disabled">Cost Explorer</Boot.MenuItem>
                </Boot.DropdownButton>
                <Link to="builds" params={params}>
                  <Boot.Button bsStyle="primary"><i className="fa fa-upload"></i> Builds</Boot.Button>
                </Link>
                <Boot.ModalTrigger modal={<PopUp action={this.deleteStack}
                message={"Are you sure you want to delete this stack?"}/>}>
                  <Boot.Button bsStyle="danger"><i className="fa fa-trash"></i> Delete</Boot.Button>
                </Boot.ModalTrigger>
              </div>
            </Boot.Col>

            <Boot.Col md={5} className="details">
              {(app) ? <a href={gitUrl} target='_blank'>
                {app.source} <i className="fa fa-github-square"/></a>
              : null}
              {(assets.hostnamePublic) ?
                <div className="endpoint" title="External Endpoint">
                  <a href={'http://' + assets.hostnamePublic} target="_blank">
                    Public Endpoint <Boot.Glyphicon glyph="new-window" />
                  </a>
                </div> : <div className="endpoint" title="External Endpoint">
                  <Boot.OverlayTrigger placement="left"
                                       overlay={<Boot.Tooltip>Not available before first deploy</Boot.Tooltip>}>
                    <span>Public Endpoint <Boot.Glyphicon glyph="new-window" /></span>
                  </Boot.OverlayTrigger>
              </div>}

              {(assets.hostnameInternal) ?
                <div className="endpoint" title="Internal Endpoint">
                  <a href={'http://' + assets.hostnameInternal} target="_blank">
                    Internal Endpoint <Boot.Glyphicon glyph="new-window" />
                  </a>
                </div> : <div className="endpoint" title="Internal Endpoint">
                <Boot.OverlayTrigger placement="left"
                                     overlay={<Boot.Tooltip>Not available before first deploy</Boot.Tooltip>}>
                  <span>Internal Endpoint <Boot.Glyphicon glyph="new-window" /></span>
                </Boot.OverlayTrigger>
              </div>}
            </Boot.Col>
          </Boot.Row>

          <Boot.Row>
            <Boot.Col md={6} sm={12} className="deploys">
              <Boot.Panel>
                <h3>Deployments</h3>
                <div className="pull-right">
                  <StoreStatus store={this.state.deploys} />
                </div>
                <div className="deploy-list">
                  {this.state.deploys.data.slice(0, 15).map(function (deploy, index) {
                    return <DeployItem deploy={deploy} key={index} buildStore={buildStore}/>;
                  })}
                </div>
              </Boot.Panel>
            </Boot.Col>
            <Boot.Col md={6} sm={12} className="events">
              <Boot.Panel>
                <h3>Events</h3>
                <div className="pull-right">
                  <StoreStatus store={this.state.events} />
                </div>
                <div className="event-list">
                  {this.state.events.data.slice(0, 15).map(function (event) {
                    if (!event.message) return null;
                    return <EventItem event={event} key={event.id} appStore={appStore} buildStore={buildStore}
                                      stackStore={stackStore} deployStore={deployStore} params={params}/>;
                  })}
                </div>
              </Boot.Panel>
            </Boot.Col>
          </Boot.Row>
        </Boot.Grid>
        <Footer />
      </div>
    );
  }
});
