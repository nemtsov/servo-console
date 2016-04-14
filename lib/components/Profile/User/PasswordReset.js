var React = require('react'),
  Boot = require('react-bootstrap'),
  regions = require('_/constants/regions'),
  request = require('_/stores/request');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      error: null,
      success: null,
      currentPassword: null,
      newPassword1: null,
      newPassword2: null
    };
  },

  render: function () {
    var error = this.state.error,
      success = this.state.success;

    return <Boot.Panel className="PasswordReset">
      <Boot.Row>
        <h3>Reset Your Password</h3>
      </Boot.Row>
      <Boot.Row md={3} mdOffset={1}>
        <Boot.Col>
          <Boot.Input type='password' label='Current Password'
                      value={this.state.currentPassword} onChange={this.handleCurrentChange}
                      labelClassName='col-xs-4' wrapperClassName='col-xs-8'/>
        </Boot.Col>
      </Boot.Row>
      <Boot.Row md={3}>
        <Boot.Col>
          <Boot.Input type='password' label='New Password'
                      value={this.state.newPassword1} onChange={this.handleNew1Change}
                      labelClassName='col-xs-4' wrapperClassName='col-xs-8'/>
        </Boot.Col>
      </Boot.Row>
      <Boot.Row md={3}>
        <Boot.Col>
          <Boot.Input type='password' label='Confirm Password'
                      value={this.state.newPassword2} onChange={this.handleNew2Change}
                      labelClassName='col-xs-4' wrapperClassName='col-xs-8'/>
        </Boot.Col>
      </Boot.Row>
      <Boot.Row md={1}>
        <Boot.Col>
          <Boot.Button bsStyle="primary" style={{marginTop:'10px'}} onClick={this.submit}>Submit</Boot.Button>
        </Boot.Col>
      </Boot.Row>
      {(error) ? <Boot.Alert bsStyle="danger">{error.message || error}</Boot.Alert> : null}
      {(success) ? <Boot.Alert bsStyle="success">{success}</Boot.Alert> : null}
    </Boot.Panel>
  },

  handleCurrentChange: function (event) {
    this.setState({currentPassword: event.target.value});
  },

  handleNew1Change: function (event) {
    this.setState({newPassword1: event.target.value});
  },

  handleNew2Change: function (event) {
    this.setState({newPassword2: event.target.value});
  },

  submit: function () {
    this.setState({error: null, success: null});
    if (!this.state.currentPassword)
      return this.setState({error: 'You must enter your current password'});
    if (!this.state.newPassword1)
      return this.setState({error: 'You must enter a new password'});
    if (this.state.newPassword1 !== this.state.newPassword2)
      return this.setState({error: 'Your new password does not match what you entered in the confirm input'});
      
    var self = this,
      url = regions[this.props.region || Object.keys(regions)[0]].endpoint + '/users/me/password',
      payload = {
        currentPassword: this.state.currentPassword,
        newPassword: this.state.newPassword1
      };
    request.post(url, payload, function (err) {
      if (err) return self.setState({error: err});
      self.setState({
        success: 'Your password has successfully been updated!',
        currentPassword: null,
        newPassword1: null,
        newPassword2: null
      });
      setTimeout(function () {
        self.setState({success: null})
      }, 3000);
    });
  }

});
