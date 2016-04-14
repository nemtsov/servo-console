var React = require('react'),
  boot = require('react-bootstrap'),
  Modal = boot.Modal,
  Button = boot.Button;

module.exports = React.createClass({
  displayName: 'PopUp',

  onConfirm: function () {
    if (this.props.action)
      this.props.action();
    return this.props.onRequestHide();
  },

  onCancel: function () {
    if (this.props.cancel)
      this.props.cancel();
    this.props.onRequestHide();
  },

  render: function () {
    var onRequestHide = this.onCancel,
      title = 'Warning' || this.props.title;

    return (
      <Modal title={title}
        bsStyle="danger"
        onRequestHide = {onRequestHide}
        backdrop={true}
        animation={true}
        ref = "modal"
        className = "create-modal">
        <div className="modal-body">
          {this.props.message}
        </div>
        <div className="modal-footer">
          <Button onClick={onRequestHide}>Cancel</Button>
          <Button onClick={this.onConfirm} bsStyle="danger">Confirm</Button>
        </div>
      </Modal>
    );
  }
});