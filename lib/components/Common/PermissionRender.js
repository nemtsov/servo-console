import React from 'react';
import {State as RouteState} from 'react-router';
import PermissionStore from '_/stores/permission';
const PropTypes = React.PropTypes;

var PermissionRender = React.createClass({
  mixins: [RouteState],

  propTypes: {
    userrole: PropTypes.string.isRequired
  },

  getInitialState() {
    const params = this.getParams();
    const options = {
      user: localStorage.getItem('username'),
      objectKey: 'context'
    };
    return {
      permissions:  new PermissionStore(params, options).register(this, 'permissions'),
    };
  },
  render() {
    const found = this.state.permissions.data.filter(item => item.userrole === this.props.userrole);
    if (found && found.length !== 0) {
      return (
        <span className={this.props.className} style={this.props.style}>
          {this.props.children}
        </span>
      );
    } else {
      return <div></div>
    }
  }
});

module.exports = PermissionRender;
