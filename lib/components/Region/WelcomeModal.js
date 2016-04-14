var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  displayName: 'WelcomeModal',


  render: function() {
    return (
      <Boot.Modal onRequestHide={this.props.onRequestHide}
        bsStyle="primary" animation={true}
        refs="modal" className="create-modal">
        <div className="modal-body">
          {this.props.content}
        </div>
      </Boot.Modal>
    );
  }
});