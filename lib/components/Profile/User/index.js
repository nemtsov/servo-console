var React = require('react'),
  Link = require('react-router').Link,
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  regions = require('_/constants/regions'),
  PasswordReset = require('./PasswordReset');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    return {
      username: null,
      password: null,
      mfa: null,
      error: null,
    };
  },

  render: function () {
    var error = this.state.error,
      username = localStorage.getItem('username'),
      name = localStorage.getItem('name'),
      gravatar = (username) ? 'https://secure.gravatar.com/avatar/' + md5(username) + '?s=200&d=mm' : null;
    return (
      <div className="ProfilePage text-center">
        <Boot.Row>
          <Boot.Col sm={4}>
            <Boot.Row>
              <img className="gravatar" src={gravatar} />
            </Boot.Row>
            <Boot.Row>
                <h2>
                  {name}
                  <br /><small>{username}</small>
                </h2>
            </Boot.Row>
          </Boot.Col>
          <Boot.Col style={{marginTop: '-50px'}} sm={8}>
            <PasswordReset region={this.props.region}/>
          </Boot.Col>
        </Boot.Row>
      </div>
    );
  }
});
