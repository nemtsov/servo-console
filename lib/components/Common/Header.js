var React = require('react'),
  Logo = require('_/components/Common/Logo'),
  Link = require('react-router').Link,
  Breadcrumbs = require('_/components/Common/Breadcrumbs'),
  Router = require('react-router'),
  Boot = require('react-bootstrap');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  componentWillUpdate: function () {
    var username = localStorage.getItem('username'),
      pathname = this.getPathname();

    if (!username && !pathname.match('\\login') && !pathname.match(/^[\w:]+\/\/[\w:]+(\.[\w]+\.[\w]+)?$/))
      this.transitionTo('login', null, {region: this.getParams().region, callback: pathname});
  },

  render: function () {
    var username = localStorage.getItem('username'),
      name = localStorage.name || username,
      gravatar = (username) ? 'https://secure.gravatar.com/avatar/' + md5(username) + '?d=mm' : null;

    return (
      <div className="Header">
        <Boot.Grid>
          <Link to='/'>
            <Logo />
          </Link>
          <Breadcrumbs />
          {(username) ? <div className="pull-right">
            <div className="help">
              <a onClick={this.help}>
                <i className="fa fa-question-circle"></i>
              </a>
            </div>
            <div className="username">
              Howdy, {name}!<br />
            <a onClick={this.logout}>Logout</a> | <a onClick={this.profile}>Profile</a>
            </div>
            <div className="gravatar">
              <img src={gravatar}/>
            </div>
          </div>: null}
        </Boot.Grid>
      </div>
    )
  },

  logout: function () {
    var query = {region: this.getParams().region, callback: this.getPathname()};
    if (query.callback.match(/^\/$/))
      query = null;
    localStorage.clear();
    this.transitionTo('login', null, query);
  },

  profile: function () {
    this.transitionTo('profile', null, this.getParams());
  },

  help: function () {
    this.transitionTo('help');
  }
});
