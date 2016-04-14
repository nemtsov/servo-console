var React = require('react'),
  Router = require('react-router'),
  RegionPage = require('_/components/Region/Page'),
  AppPage = require('_/components/App/Page'),
  StackPage = require('_/components/Stack/Page'),
  DeployPage = require('_/components/Deploy/Page'),
  NewDeploy = require('_/components/Deploy/NewDeploy'),
  MapPage = require('_/components/Map/Page'),
  BuildPage = require('_/components/Build/Page'),
  EnvironmentVariablesPage = require('_/components/EnvironmentVariables/Page'),
  WorkerSettingsPage = require('_/components/WorkerSettings/Page'),
  NetworkAccessPage = require('_/components/NetworkAccess/Page'),
  LogsPage = require('_/components/Logs/Page'),
  LoginPage = require('_/components/Login/Page'),
  ProfilePage = require('_/components/Profile/Page'),
  CopyStackPage = require('_/components/CopyStack/Page'),
  NewRelicPage = require('_/components/NewRelic/Page'),
  DockerPage = require('_/components/Docker/Page'),
  HelpPage = require('_/components/Help/Page'),
  PermissionPage = require('_/components/Permission/Page'),
  WorkersPage = require('_/components/Workers/Page'),
  NotificationPage = require('_/components/Notification/Page'),
  AdminConfigPage = require('_/components/AdminConfig/Page'),
  DistributionPage = require('_/components/Distribution/Page');

React.initializeTouchEvents(true);

var routes = (
  <Router.Route path="/">
    <Router.Route name="map" path="/" handler={MapPage} />
    <Router.Route name="login" path="/login" handler={LoginPage} />
    <Router.Route name="profile" path="/profile/:setting?" handler={ProfilePage} />
    <Router.Route name="help" path="/help" handler={HelpPage} />
    <Router.Route name="org" path="/orgs/:org" handler={MapPage} />
    <Router.Route name="region" path="/orgs/:org/regions/:region" handler={RegionPage} />
    <Router.Route name="createApp" path="/orgs/:org/regions/:region" handler={RegionPage} />
    <Router.Route name="app" path="/orgs/:org/regions/:region/apps/:app" handler={AppPage} />
    <Router.Route name="stack" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack" handler={StackPage} />
    <Router.Route name="workers" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/workers" handler={WorkersPage} />
    <Router.Route name="copyStack" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/copy" handler={CopyStackPage} />
    <Router.Route name="newDeploy" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/deploys/new" handler={NewDeploy} />
    <Router.Route name="deploy" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/deploys/:deploy" handler={DeployPage} />
    <Router.Route name="stackEnvironmentVariables" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/environmentVariables" handler={EnvironmentVariablesPage} />
    <Router.Route name="stackWorkerSettings" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/workerSettings" handler={WorkerSettingsPage} />
    <Router.Route name="newrelic" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/newrelic" handler={NewRelicPage} />
    <Router.Route name="logs" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/logs" handler={LogsPage} />
    <Router.Route name="stackNetworkAccess" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/network" handler={NetworkAccessPage} />
    <Router.Route name="builds" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/builds" handler={BuildPage} />
    <Router.Route name="appPermissions" path="/orgs/:org/regions/:region/apps/:app/permissions" handler={PermissionPage} />
    <Router.Route name="stackPermissions" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/permissions" handler={PermissionPage} />
    <Router.Route name="stackNotifications" path="/orgs/:org/regions/:region/apps/:app/stacks/:stack/notifications" handler={NotificationPage} />
    <Router.Route name="docker" path="/orgs/:org/regions/:region/apps/:app/docker" handler={DockerPage} />
    <Router.Route name="distributions" path="/orgs/:org/regions/:region/sitecontrol" handler={DistributionPage} />
    <Router.Route name="adminConfigs" path="/orgs/:org/regions/:region/config/:config?" handler={AdminConfigPage} />
  </Router.Route>
);

document.addEventListener("DOMContentLoaded", function() {
  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.body);
  });
});
