var React = require('react'),
  PermItem = require('./PermItem'),
  Boot = require('react-bootstrap'),
  Router = require('react-router'),
  weight = {member: 0, owner: 1};

module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  sortPerms: function (permA, permB) {
    var weightA = weight[permA.userrole],
      weightB = weight[permB.userrole];
    if (weightA !== weightB) return weightA < weightB;
    return permA.username > permB.username;
  },

  render: function () {
    var params = this.getParams(),
      showApp = (params.stack),
      appPermissions = this.props.appPermissions.sort(this.sortPerms),
      orgPermissions = this.props.orgPermissions.sort(this.sortPerms);

    return (
      <Boot.Panel>
        <h3>Inherited Permissions</h3>
        {(showApp) ? appPermissions.map(this.renderPermission) : null}
        {orgPermissions.map(this.renderPermission)}
      </Boot.Panel>
    );
  },

  renderPermission: function (perm) {
    var contextSegments = perm.context.split(':'),
      isOrg = (contextSegments.length === 1),
      styles = {member: 'info', owner: 'primary'};
    return <div key={perm.userrole + perm.username + perm.context}>
      <Boot.Label bsStyle={styles[perm.userrole]}>
        {perm.userrole}
      </Boot.Label> {perm.username} <small><i>from {(isOrg) ? 'org' : 'app'}</i></small>
    </div>
  }
});
