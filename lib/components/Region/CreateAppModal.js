var React = require('react'),
  _ = require('lodash'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  displayName: 'AppCreateModal',

  getInitialState: function (){
    return {
      nameInputValue: 'My Great Application',
      sourceInputValue: '',
      nameInputValid: false,
      sourceInputValid: false
    }
  },

  createApp: function (event) {
    if (!this.isValid()) return;
    var self = this,
      app = {
        name: this.state.nameInputValue,
        source: this.state.sourceInputValue
      };
    this.props.store.post(app, function (err) {
      if (err) return self.setState({error: err});
      self.props.onRequestHide(event);
    });
  },

  isValid: function () {
    // TODO: move this function out
    function nameContainsAnyOf(name, reservedWords) {
      var foundOne = false;

      _.forEach(reservedWords, function (reservedWord) {
        foundOne = _.contains(name, reservedWord);
        return !foundOne;
      });

      return foundOne;
    }

    var nameValidations = [],
      reserved = [
        'mongodb',
        'dynamodb',
        's3',
        'sqs',
        'mysql',
        'postgresql',
        'redis',
        'memcached',
        'elasticsearch',
        'builders'
      ];

    var inputIsValid = true;

    if (!this.state.nameInputValue) nameValidations.push('Name is required');
    if ((/^\d/).test(this.state.nameInputValue))
      nameValidations.push('Name can not start with a digit. ');
    if (nameContainsAnyOf(this.state.nameInputValue, reserved))
      nameValidations.push('Name can not contain a reserved word. ');
    if (nameValidations.length > 0) {
      this.setState({nameValid: nameValidations});
      inputIsValid = false;
    }

    if (!this.state.sourceInputValue) {
      this.setState({sourceValid: "A repo is required"});
      inputIsValid = false;
    }
    return inputIsValid;
  },

  handleNameChange: function (e){
    this.setState({nameInputValue: e.target.value, nameValid: null});
  },

  handleSourceChange: function (e){
    this.setState({sourceInputValue: e.target.value, sourceValid: null});
  },

  render: function() {
    var name = this.state.nameInputValue,
      nameValid = this.state.nameValid,
      sourceValid = this.state.sourceValid;

    return (
      <Boot.Modal onRequestHide={this.props.onRequestHide} bsStyle="primary" title="Setup a New Application"
        animation={true} refs="modal" className="CreateAppModal create-modal">
        <div className="modal-body">
          {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error.message}</Boot.Alert> : null}
          <form>
            <h4>Application Name</h4>
            <Boot.Input type="text" onChange={this.handleNameChange} value={this.state.nameInputValue}
                        onFocus={this.nameFocus} bsStyle={nameValid ? "error" : null }/>
              {nameValid ? nameValid.forEach(function (str) {
                return (<span className="invalid"> {str} </span>);
                }) : null}
            {(nameValid) ? <span className="invalid">{nameValid}<br /></span> : null}
            <div className="handleExplain">
              <small>
                  Your app handle will be <strong>{name.replace(/\s/g, '-').toLowerCase()}</strong>
                  <br />Handles are used in external systems such as DNS hostnames, Notifications, etc.
              </small>
            </div>
            <h4>Git Repository URL <small>use the same url you use when running `git clone`</small></h4>
            <Boot.Input type="text" onChange={this.handleSourceChange} bsStyle={sourceValid ? "error" : null }/>
            <span className="invalid">{sourceValid ? sourceValid : null}</span>
            <Boot.Button className="center-block" bsStyle="success" onClick={this.createApp}>
              <i className="fa fa-check"></i> Create
            </Boot.Button>
          </form>
        </div>
      </Boot.Modal>
    );
  },

  nameFocus: function (event) {
    if (event.target.value === 'My Great Application') this.setState({nameInputValue: ''});
  }
});
