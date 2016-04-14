var React = require('react'),
  Map = require('./Map'),
  Header = require('_/components/Common/Header'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  orgs = require('_/constants/orgs');

if (process.env.NODE_ENV === 'production')
  delete orgs.localhost;

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var defaultOrg = orgs[Object.keys(orgs)[0]].handle;
    return {
      org: this.getParams().org || defaultOrg
    };
  },

  render: function() {
    return(
      <div className="MapPage">
        <Header />
        <Boot.Grid>
          <Boot.Row>
            <Boot.Col md={2}>
              <h4>Organizations</h4>
              <Boot.Nav className="nav-stacked" bsStyle='pills' activeKey={this.state.org} onSelect={this.orgSelect}>
                {Object.keys(orgs).map(function (org) {
                  return <Boot.NavItem key={org} eventKey={org}>{orgs[org].name}</Boot.NavItem>
                })}
              </Boot.Nav>
            </Boot.Col>
            <Boot.Col md={10}>
              <Map org={orgs[this.state.org]}/>
            </Boot.Col>
          </Boot.Row>
        </Boot.Grid>
      </div>
    );
  },

  orgSelect: function (org) {
    this.setState({org: org})
  }
});
