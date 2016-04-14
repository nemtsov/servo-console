var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  displayName: 'DeployCreateModal',

  getInitialState: function () {
    return {error: null};
  },

  buildItem: function (build, key) {
    var message = (build.commit) ? build.commit.message || build.commit.commit.message : null;
    return <div key={key}>
      <Boot.Button onClick={this.deploy.bind(this, build)} bsStyle="primary">Deploy</Boot.Button>
      <span className='sha'>{build.commit.sha.slice(0,7)}</span> {message}
    </div>
  },

  deploy: function (build) {
    var self = this;
    this.props.deployStore.post({buildId: build.id}, function (err) {
      if (err) return self.setState({error: err});
      self.props.onRequestHide();
    });
  },

  render: function () {
    var builds = this.props.buildStore.data,
      error = this.state.error,
      completeBuilds;

    completeBuilds = builds.filter(function(obj){
        return obj.state === "COMPLETE";
      });

    return (
      <Boot.Modal onRequestHide={this.props.onRequestHide}
        bsStyle="primary" title="New Deployment" animation={true}
        refs="modal" className="create-modal">
        <div className="CreateDeployModal modal-body">
          {(error) ? <Boot.Alert bsStyle="danger">{error.message}</Boot.Alert> : null}
          {completeBuilds.map(this.buildItem)}
        </div>
      </Boot.Modal>
    );
  }
});