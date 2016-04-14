var React = require('react'),
  Boot = require('react-bootstrap'),
  QRCode = require('qrcode.react'),
  regions = require('_/constants/regions'),
  request = require('_/stores/request');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      error: null,
      key: null
    };
  },

  render: function () {
    var error = this.state.error,
      username = this.props.username,
      qr = 'otpauth://totp/Servo:' + username + '?issuer=Servo&secret=' + this.state.key,
      done = this.props.done;

    return <div className="MfaSetup">
      {(this.state.key) ?
        <div className="text-center">
          <QRCode value={qr} />
          <p>Once you have your MFA setup, <a onClick={done}>click here to login</a>.</p>
          <p><strong><small>
            This cannot be retrieved again without contacting your Servo administrator!
          </small></strong></p>
        </div>
      : <Boot.Alert bsStyle="info">
        You need to setup Multi-Factor Authentication for your account before
        you can proceed. This requires a TOTP compliant app such as Google
        Authenticator. When ready, <a onClick={this.retrieveKey}>click here
        to retrieve your MFA secret</a>. <strong><small>This can only be done once!</small></strong>
      </Boot.Alert>}
      {(error) ? <Boot.Alert bsStyle="danger">{error}</Boot.Alert> : null}
    </div>
  },

  retrieveKey: function () {
    var self = this,
      url = regions[this.props.region].endpoint + '/users/me/mfa?token=' + this.props.token;
    this.setState({error: null});
    request.get(url, function (err, res, data) {
      if (err) return self.setState({error: err});
      if (!data.key) return self.setState({error: 'MFA key not returned'});
      self.setState({key: data.key});
    });
  }
});