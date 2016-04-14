var React = require('react'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  displayName: 'StackCreateModal',

  getInitialState: function (){
    return {
      nameInputValue: 'Feature 42',
      nameInputValid: false
    }
  },

  createStack: function (event) {
    if (!this.isValid()) return;
    var self = this,
      stack = {
        name: this.state.nameInputValue
      };
    this.props.store.post(stack, function (err) {
      if (err) return self.setState({error: err});
      self.props.onRequestHide(event);
    });
  },

  isValid: function () {
    var inputIsValid = true,
      nameValidations=[];

    if (!this.state.nameInputValue) nameValidations.push('Name is required');
    if ((/^\d/).test(this.state.nameInputValue)) nameValidations.push('Name can not start with a number. ');
    if (nameValidations.length > 0) {
      this.setState({nameValid: nameValidations});
      inputIsValid = false;
    }

    return inputIsValid;
  },

  handleNameChange: function (e){
    this.setState({nameInputValue: e.target.value,
      nameValid: null});
  },

  handleNameKey: function (event) {
    if (event.keyCode === 13) this.createStack();
  },

  nameFocus: function (event) {
    if (event.target.value === 'Feature 42') this.setState({nameInputValue: ''});
  },

  render: function() {
    var name = this.state.nameInputValue,
      nameValid = this.state.nameValid;

    return (
      <Boot.Modal onRequestHide={this.props.onRequestHide} bsStyle="primary" title="Setup a New Stack"
        animation={true} refs="modal" className="CreateStackModal create-modal">
        <div className="modal-body">
          {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error.message}</Boot.Alert> : null}
          <h4>Stack Name</h4>
          <Boot.Input type="text" onChange={this.handleNameChange}
                      onKeyDown={this.handleNameKey}
                      value={this.state.nameInputValue}
                      onFocus={this.nameFocus}
                      bsStyle={nameValid ? "error" : null } />
          {nameValid ? nameValid.forEach(function (str) {
            return (<span className="invalid"> {str} </span>);
          }) : null} <span className="invalid">{nameValid ? nameValid : null}</span>
          <div className="handleExplain">
            <small>
              Your app handle will be <strong>{name.replace(/\s/g, '-').toLowerCase()}</strong>
              <br />Handles are used in external systems such as DNS hostnames, Notifications, etc.
            </small>
          </div>
          <Boot.Button className="center-block" bsStyle="success" onClick={this.createStack}>
            <i className="fa fa-check"></i> Create
          </Boot.Button>
        </div>
      </Boot.Modal>
    );
  }
});