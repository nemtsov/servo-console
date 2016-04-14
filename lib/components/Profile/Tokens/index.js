var React = require('react'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  TokenItem = require('./TokenItem'),
  TokenForm = require('./TokenForm'),
  regions = require('_/constants/regions'),
  TokenStore = require('_/stores/tokens'),
  StoreStatus = require('_/components/Common/StoreStatus');

module.exports = React.createClass({
  mixins: [Router.State],
  displayName: 'Tokens',

  getInitialState: function () {
    const params = this.getParams();
    params.region = this.props.region;

    return {
      tokens: new TokenStore(params).register(this, 'tokens'),
      alert: null,
      loading: false,
    };
  },

  render: function () {
    var alert = this.state.alert;
    var self = this;
    var tokenList = this.state.tokens.data;

    var tokens = tokenList.map(function (token, idx) {
      return <TokenItem
        key={token.name}
        token={token}
        idx={idx}
        onDelete={self.removeToken}
        disabled={self.state.loading}/>
    });

    if (alert) {
      alert = (
        <Boot.Row><Boot.Col xs={12}>
          <Boot.Alert
            dismissAfter={2000}
            bsStyle={alert.style || 'danger'}>
              {alert.message || alert}
          </Boot.Alert>
        </Boot.Col></Boot.Row>
        )
    }

    return (
      <Boot.Panel className="Tokens">
        <div>
          <h3>Tokens
            <div className='pull-right'>
              <small><StoreStatus store={this.state.tokens} /></small>
            </div>
          </h3>
        </div>
        {tokens}
        <hr></hr>
        <TokenForm
          region={this.props.region}
          addToken={this.addToken}
          setAlert={this.setAlert}/>
        {alert}
        <div id='copied' style={{
            visibility: 'hidden',
            width: '50px',
            height: '50px',
            position: 'fixed',
          }}>Copied!</div>
      </Boot.Panel>
    )
  },

  addToken: function(tokenName, cb) {
    if (!tokenName)
      return this.setAlert({message: 'Error: No Token Name!'});

    var self = this;
    this.setAlert(null);
    this.state.tokens.post({name: tokenName}, function(err, data) {
      cb();
      if (err) return self.setAlert({message: err.message});
      if (!data.name) return self.props.setAlert({message: body});
    });
  },

  removeToken: function(token, idx) {
    var self = this,
      url = regions[this.props.region || Object.keys(regions)[0]].endpoint + '/users/me/tokens/' + token.name;

    self.setState({
      loading: true,
      alert: ''
    });

    this.state.tokens.del(token.name, function(err) {
      self.setState({
        loading: false,
      });
      if (err) return self.setAlert(err.message);
    })
  },
  setAlert: function(alert) {
    this.setState({
      alert: alert,
      loading: false
    });
  }
});
