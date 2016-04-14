var React = require('react'),
  Header = require('_/components/Common/Header'),
  Footer = require('_/components/Common/Footer'),
  StoreStatus = require('_/components/Common/StoreStatus'),
  Boot = require('react-bootstrap'),
  PermissionStore = require('_/stores/permission'),
  LocalPermissions = require('./LocalPermissions'),
  InheritedPermissions = require('./InheritedPermissions'),
  Router = require('react-router');

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function () {
    var params = this.getParams(),
      orgParams = {org: params.org, region: params.region},
      appParams = {org: params.org, region: params.region, app: params.app},
      state = {
        orgPermissions: new PermissionStore(orgParams).register(this, 'orgPermissions'),
        appPermissions: new PermissionStore(appParams).register(this, 'appPermissions')
      };

    if (params.stack)
      state.stackPermissions = new PermissionStore(params).register(this, 'stackPermissions');

    return state;
  },

  addPermission: function (username, userrole, cb) {
    var params = this.getParams(),
      store = params.stack ? this.state.stackPermissions : this.state.appPermissions;

    store.post({username: username, userrole: userrole}, function (err) {
      if (err) this.setState({error: err.message});
      else this.setState({error: null});
      cb();
    }.bind(this));
  },

  updatePermission: function (username, userrole, cb) {
    var params = this.getParams(),
      store = params.stack ? this.state.stackPermissions : this.state.appPermissions;

    store.put(username, {userrole: userrole}, function (err) {
      if (err) this.setState({error: err.message});
      else this.setState({error: null});
      cb();
    }.bind(this));
  },

  removePermission: function (username, cb) {
    var params = this.getParams(),
      store = params.stack ? this.state.stackPermissions : this.state.appPermissions;

    store.del(username, function (err) {
      if (err) this.setState({error: err.message});
      else this.setState({error: null});
      cb();
    }.bind(this));
  },

  render: function () {
    var params = this.getParams(),
      isStack = !!params.stack;
    return (
      <div>
        <Header />
        <Boot.Grid>
          <div className="Title">
            <h1>Permissions Configuration</h1>
            <StoreStatus store={this.state.orgPermissions} />
          </div>
          <Boot.Well>
            Here you can configure user permissions for apps and stacks. Servo permissions assigned at an app level
            are inherited by all stacks underneath. You can assign users one of the two following roles:
            <ul>
              <li><strong>member</strong> able to configure, read logs, run builds, and start deploys of a stack</li>
              <li><strong>owner</strong> able to manage permissions, delete stacks, and read secrets in addition
              to everything members can do</li>
            </ul>
          </Boot.Well>
          {(this.state.error) ? <Boot.Alert bsStyle="danger">{this.state.error}</Boot.Alert> : null}
          <Boot.Row>
            <Boot.Col md={7}>
              <LocalPermissions
                permissions={(isStack) ? this.state.stackPermissions.data : this.state.appPermissions.data}
                addPermission={this.addPermission}
                updatePermission={this.updatePermission}
                removePermission={this.removePermission}/>
            </Boot.Col>
            <Boot.Col md={5}>
              <InheritedPermissions
                appPermissions={this.state.appPermissions.data}
                orgPermissions={this.state.orgPermissions.data}/>
            </Boot.Col>
          </Boot.Row>
        </Boot.Grid>
        <Footer />
      </div>
    );
  }
});
