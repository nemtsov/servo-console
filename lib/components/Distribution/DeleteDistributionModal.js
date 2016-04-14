var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  getInitialState: function (){
    return {
      error: null,
      deleting: false,
      deleted: false
    }
  },

  deleteDistribution: function (event) {
    var self = this;
    this.setState({deleting: true});
    this.props.store.del(this.props.distributionId, function (err) {
      if (err) return self.setState({error: err, deleting: false});
      self.setState({deleted: true});
      self.props.hide(event);
    })
  },

  render: function() {
    if (this.state.deleted) return null;
    var distributionId = this.props.distributionId,
      distribution = this.props.store.get(distributionId);
    return (
      <Boot.Modal onHide={this.props.hide} onRequestHide={this.props.hide} bsStyle="danger" title="Delete Site Control Distribution"
        animation={true} refs="modal">
        <div className="modal-body">
          {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error.message}</Boot.Alert> : null}
          <p>
            Are you absolutely sure you want to delete the
            distribution <strong>{distribution.endpoint}</strong> completely?
          </p>
          <p><small>You can only delete a distribution if it has no origins configured!</small></p>
          <Boot.Button bsStyle="danger" onClick={this.deleteDistribution} disabled={this.state.deleting}>
            {(this.state.deleting) ? 'Deleting' : 'Yes, delete it!'}
          </Boot.Button>
        </div>
      </Boot.Modal>
    );
  }
});
