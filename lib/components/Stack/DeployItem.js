var React = require('react'),
  Boot = require('react-bootstrap'),
  TimeAgo = require('_/components/Common/TimeAgo'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State],

  stateClass: function (state) {
    switch (state) {
      case 'COMPLETE':
        return 'success';
      break;
      case 'PENDING':
        return 'warning';
      break;
      case 'FAILED':
        return 'danger';
      break;
    }
  },

  render: function () {
    var params = this.getParams(),
      stateClass = this.stateClass(this.props.deploy.state),
      deploy = this.props.deploy,
      build = this.props.buildStore.get(deploy.buildId),
      message = deploy.description,
      linkParams = {org: params.org, region: params.region, app: params.app, stack: params.stack, deploy: deploy.id};
    if (!message) message = (build && build.commit) ? build.commit.message || build.commit.commit.message : null;
    return (
      <div key={deploy.id} className="DeployItem row">
        <div className="col-md-2 state">
          <Boot.Label bsStyle={stateClass}>{deploy.state}</Boot.Label>
        </div>
        <div className="col-md-7 commit">
          <Router.Link to="deploy" params={linkParams}>
            {(build) ? message : 'Loading...'}
          </Router.Link>
        </div>
        <div className="col-md-3 time">
          <TimeAgo date={deploy._createdAt} />
        </div>
      </div>
    );
  }
});

