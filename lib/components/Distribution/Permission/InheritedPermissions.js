import React from 'react';
import Boot from 'react-bootstrap';
import PermItem from './PermItem';

const weight = {member: 0, owner: 1};

module.exports = React.createClass({

  sortPerms(permA, permB) {
    var weightA = weight[permA.userrole],
      weightB = weight[permB.userrole];
    if (weightA !== weightB) return weightA < weightB;
    return permA.username > permB.username;
  },

  render() {
    const params = this.props.params;
    const showDist = params.origin;
    const distPermissions =this.props.distPermissions.sort(this.sortPerms);
    const orgPermissions = this.props.orgPermissions.sort(this.sortPerms);

    return (
      <Boot.Panel>
        <h3>Inherited Permissions</h3>
          {(showDist) ? distPermissions.map(this.renderPermission) : null}
          {orgPermissions.map(this.renderPermission)}
      </Boot.Panel>
    );
  },

  renderPermission(perm) {
    var contextSegments = perm.context.split(':'),
      isOrg = (contextSegments.length === 1),
      styles = {member: 'info', owner: 'primary'};
    return <div key={perm.userrole + perm.username + perm.context}>
      <Boot.Label bsStyle={styles[perm.userrole]}>
        {perm.userrole}
      </Boot.Label> {perm.username} <small><i>from {(isOrg) ? 'org' : 'distribution'}</i></small>
    </div>
  }
});
