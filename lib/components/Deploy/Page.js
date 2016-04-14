var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  DeployStore = require('_/stores/deploy'),
  Router = require('react-router'),
  Comparison = require('./Comparison'),
  moment = require('moment');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams();
    return {
      deploys: new DeployStore(params).register(this, 'deploys')
    };
  },

  render: function () {
    var params = this.getParams(),
      deployId = params.deploy,
      deploy = this.state.deploys.get(deployId),
      previousDeploy = (deploy && deploy.previousDeploy) ? this.state.deploys.get(deploy.previousDeploy) : null;

    return (
      <div className="DeployPage">
        <Header />
        <Boot.Grid>
          <div className="Title">
            <h1>Deploy Summary <small>{deployId}</small></h1>
            <StoreStatus store={this.state.deploys} />
          </div>
          {(deploy) ?
          <h4>
            <Boot.Label bsStyle={this.stateColor(deploy.state)}>
            {deploy.state}
          </Boot.Label> {(deploy.state === 'FAILED') ?
            deploy.failureReason :
            <span>Started {moment(deploy._createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}</span>}
          </h4> : null}
          {(deploy && deploy.description) ? <h4>{deploy.description}</h4> : null}
          <Comparison older={previousDeploy} newer={deploy} />
        </Boot.Grid>
        <Footer />
      </div>
    );
  },

  stateColor: function (state) {
    var colors = {
      PENDING: 'warning',
      COMPLETE: 'success',
      FAILED: 'danger'
    };
    return colors[state] || 'default'
  }
});