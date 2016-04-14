var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  getInitialState: function (){
    return {
      error: null,
      deleting: false
    }
  },

  deleteOrigin: function (event) {
    var self = this;
    this.setState({deleting: true});
    this.props.store.del(this.props.origin.id, function (err) {
      if (err) return self.setState({error: err, deleting: false});
      self.setState({deleting: false});
      self.props.onRequestHide(event);
    })
  },

  render: function() {
    var origin = this.props.origin;
    return (
      <Boot.Modal onRequestHide={this.props.onRequestHide} bsStyle="danger" title="Delete Site Control Origin"
        animation={true} refs="modal">
        <div className="modal-body">
          {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error.message}</Boot.Alert> : null}
          <p>
            Are you absolutely sure you want to delete the origin <strong>{origin.address}</strong> from this
            distribution? This cannot be reversed!
          </p>
          <Boot.Button bsStyle="danger" onClick={this.deleteOrigin} disabled={this.state.deleting}>
            {(this.state.deleting) ? 'Deleting' : 'Yes, delete it!'}
          </Boot.Button>
        </div>
      </Boot.Modal>
    );
  }
});
